<div class="p-3 flex h-1/3">
    <img src="/logo.png" class="" alt="">
    <div class="flex flex-1 justify-center flex-col items-center">
        <h1 class="text-[#b77236] font-bold text-6xl mb-2 text-center w-full">
            Menu de la semaine
        </h1>
        <p class="text-[#e6a515] font-bold text-3xl text-center w-full">
            Semaine du {(() => {
                const d = new Date();
                d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7));
                return d.toLocaleDateString('fr-FR', { day: '2-digit' });
            })()} au {
                (() => {
                const d = new Date();
                d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7) + 4);
                return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' });
            })()
            }
        </p>
    </div>
</div>