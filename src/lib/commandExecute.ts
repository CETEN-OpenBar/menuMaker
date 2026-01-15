import { MealManager, Meal } from "$lib/MealManager";
import { headers, dayAlias, FrontState } from "$lib/constants";
import { toPng } from 'html-to-image';
import { generateMailMenu } from "$lib/mailGenerator";

export interface CommandContext {
    setLoading: (loading: boolean) => void;
    setFrontState?: (state: string) => void;
    currentState?: string;
}

function resolveDayIndex(token: string): number {
    const normalized = token.toLowerCase();
    let label = normalized;
    
    if (dayAlias[normalized]) {
        label = dayAlias[normalized];
    }

    return headers.findIndex(h => h.toLowerCase() === label);
}

export function executeCommand(command: string, context: CommandContext): { success: boolean; message: string } {
    const manager = MealManager.getInstance();
    if (!manager.currentMenu) {
        return {
            success: false,
            message: 'Menu data is not initialized.'
        };
    }

    const trimmed = command.trim();
    const normalizedCommand = trimmed.toLowerCase();

    if (normalizedCommand === 'view-vertical' || normalizedCommand === 'view-v') {
        if (context.setFrontState) {
            context.setFrontState(FrontState.VERTICAL);
            return { success: true, message: 'Switched to Vertical View' };
        }
    }

    if (normalizedCommand === 'view-horizontal' || normalizedCommand === 'view-h') {
        if (context.setFrontState) {
            context.setFrontState(FrontState.HORIZONTAL);
            return { success: true, message: 'Switched to Horizontal View' };
        }
    }

    if (normalizedCommand === 'view-mail' || normalizedCommand === 'view-m') {
        if (context.setFrontState) {
            context.setFrontState(FrontState.MAIL);
            return { success: true, message: 'Switched to Mail View' };
        }
    }

    if (normalizedCommand === 'generate' || normalizedCommand === 'gen') {
        // Generation logic is not yet implemented in this project
        return {
            success: false,
            message: 'Generation feature is not available.'
        };
    }

    if (normalizedCommand === 'copymail' || normalizedCommand === 'cp') {
        const meals = manager.currentMenu.meals;
        generateMailMenu(meals)
            .then((text) => {
                navigator.clipboard.writeText(text);
                // We can't easily notify success back to the UI asynchronously from here
                // without changing the contract, but console log helps debugging
                console.log('Mail copied to clipboard');
            })
            .catch((err) => {
                console.error('Failed to copy mail:', err);
            });
            
        return {
            success: true,
            message: 'Surely copied mail to clipboard...'
        };
    }

    if (normalizedCommand === 'screenshot' || normalizedCommand === 'shot') {
        const targetId = context.currentState === FrontState.HORIZONTAL ? 'menu-horizontal' : 'menu-vertical';
        const element = document.getElementById(targetId);
        
        if (element) {
            toPng(element, { 
                cacheBust: true, 
                pixelRatio: 2, 
                skipFonts: true,
                width: element.clientWidth,
                height: element.clientHeight,
                style: {
                    transform: 'none',
                    margin: '0'
                }
            })
                .then((dataUrl) => {
                    let week = '';
                    const now = new Date();
                    const day = now.getDate();
                    const month = now.getMonth() + 1;
                    const year = now.getFullYear();
                    const d = new Date(now);
                    d.setDate(d.getDate() - (d.getDay() || 7) + 1);
                    const fmt = (dt: Date) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
                    const mon = fmt(d);
                    d.setDate(d.getDate() + 4);
                    week = `${mon}_${String(d.getDate()).padStart(2, '0')}`;
                    const link = document.createElement('a');
                    link.download = `menu-${context.currentState || 'view'}-${week}.png`;
                    link.href = dataUrl;
                    link.click();
                })
                .catch((err) => {
                    console.error('Screenshot failed:', err);
                });
            
            return { success: true, message: 'Screenshot started...' };
        } else {
             return { success: false, message: 'Menu element not found.' };
        }
    }

    const clearMatch = trimmed.match(/^([a-zA-Z]+)-(u|l)-(clear|empty|reset)$/i);
    if (clearMatch) {
        const [, dayToken, zoneToken] = clearMatch;
        const dayIndex = resolveDayIndex(dayToken);
        
        if (dayIndex === -1) {
             return { success: false, message: `Unknown day "${dayToken}".` };
        }

        const zoneIndex = zoneToken.toLowerCase() === 'u' ? 0 : 1;
        const dayLabel = headers[dayIndex];
        
        const currentMeals = manager.currentMenu.meals[dayIndex];
        
        // Clear the zone
        currentMeals[zoneIndex] = new Meal("", "", true);
        
        // If upper is cleared, clear lower too (as per original logic)
        if (zoneIndex === 0) {
             currentMeals[1] = new Meal("", "", true);
        }
        
        manager.currentMenu.meals[dayIndex] = currentMeals;
        manager.currentMenu.saveMenu();
        manager.notifyUpdate();
        
        return {
            success: true,
            message: `Cleared the ${zoneIndex === 0 ? 'upper' : 'lower'} zone for ${dayLabel}.`
        };
    }

    const match = trimmed.match(/^([a-zA-Z]+)-(u|l)-(s|t)\s+(.+)$/);
    if (!match) {
        return {
            success: false,
            message: 'Invalid command. Use day-zone-type value or day-zone-clear.'
        };
    }

    const [, dayToken, zoneToken, typeToken, payload] = match;
    const dayIndex = resolveDayIndex(dayToken);
    
    if (dayIndex === -1) {
        return { success: false, message: `Unknown day "${dayToken}".` };
    }

    const zoneIndex = zoneToken.toLowerCase() === 'u' ? 0 : 1;
    const value = payload.trim();
    const dayLabel = headers[dayIndex];

    if (zoneIndex === 1) {
        const upperMeal = manager.currentMenu.meals[dayIndex][0];
        // Check if upper is "used". In original code `is_used`.
        // Here we check if it has content.
        if (!upperMeal || (upperMeal.name === "" && upperMeal.isText)) {
             return {
                success: false,
                message: `Configure the upper zone for ${dayLabel} before using the lower zone.`
            };
        }
    }

    const type = typeToken.toLowerCase();
    const currentMeals = manager.currentMenu.meals[dayIndex];

    if (type === 's') {
        const mealList = manager.getMeals();
        const lowerValue = value.toLowerCase();
        let mealOption = mealList.find((meal) => meal.name.toLowerCase() === lowerValue);

        if (!mealOption) {
            const partialMatches = mealList.filter((meal) =>
                meal.name.toLowerCase().includes(lowerValue)
            );
            if (partialMatches.length === 1) {
                mealOption = partialMatches[0];
            } else if (partialMatches.length > 1) {
                return {
                    success: false,
                    message: `Multiple sandwiches match "${value}". Please be more specific.`
                };
            }
        }

        if (!mealOption) {
            return {
                success: false,
                message: `Sandwich "${value}" was not found in the meal list.`
            };
        }

        currentMeals[zoneIndex] = new Meal(mealOption.name, mealOption.image, false);
        manager.currentMenu.meals[dayIndex] = currentMeals;
        manager.currentMenu.saveMenu();
        manager.notifyUpdate();

        return {
            success: true,
            message: `Set ${dayLabel} ${zoneIndex === 0 ? 'upper' : 'lower'} zone to sandwich "${mealOption.name}".`
        };

    } else {
        currentMeals[zoneIndex] = new Meal(value, "", true);
        manager.currentMenu.meals[dayIndex] = currentMeals;
        manager.currentMenu.saveMenu();
        manager.notifyUpdate();
        
        return {
            success: true,
            message: `Updated ${dayLabel} ${zoneIndex === 0 ? 'upper' : 'lower'} zone text.`
        };
    }
}
