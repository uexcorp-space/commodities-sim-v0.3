document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const playerBalanceEl = document.getElementById('player-balance');
    const gameTimeDisplayEl = document.getElementById('game-time-display');
    const playerInventoryListEl = document.getElementById('player-inventory-list');
    const shopInstockListEl = document.getElementById('shop-instock-list');
    const shopOutofstockListEl = document.getElementById('shop-outofstock-list');
    const transactionStatusEl = document.getElementById('transaction-status');
    const eventBannerEl = document.getElementById('event-banner');
    const tabButtons = document.querySelectorAll('.shop-navigation-tabs .tab-button');
    const tabContents = document.querySelectorAll('.shop-content .tab-content');
    const locationSelectEl = document.getElementById('location-select');
    const currentShipNameEl = document.getElementById('current-ship-name');
    const currentCargoDisplayEl = document.getElementById('current-cargo-display');
    const shopLocationNameEl = document.getElementById('shop-location-name');
    const saveGameButton = document.getElementById('save-game-button');
    const loadGameButton = document.getElementById('load-game-button');
    const marketOverviewListEl = document.getElementById('market-overview-list');
    const marketOverviewLocationNameEl = document.getElementById('market-overview-location-name');

    // --- GAME STATE & DATA ---
    let gameState = {
        playerName: "CmdrTest",
        balance: 100000,
        currentShipId: 'aurora_mr',
        currentLocationId: 'cru_l5',
        gameTime: new Date(Date.UTC(2953, 0, 1, 10, 0, 0)),
        gameTimeSpeedFactor: 7200, // 1 sec real = 2 hours game
        isTransactionInProgress: false,
        lastRealTimeUpdate: Date.now(),
        activeEvents: [], // { eventId, locationId, commodityId (optional), endTime }
    };

    // (shipData, locationData, commodityDefinitions, playerInventory, marketStock are defined below)
    // ... (Collez ici les structures de données de mon message précédent) ...
    // COPIEZ LES STRUCTURES DE DONNÉES D'ICI :
    const shipData = {
        'aurora_mr': { name: 'AURORA MR', cargo_capacity_scu: 6, base_manual_load_time_per_scu: 30 },
        'cutlass_black': { name: 'CUTLASS BLACK', cargo_capacity_scu: 46, base_manual_load_time_per_scu: 25 },
    };

    const locationData = {
        'cru_l5': { id: 'cru_l5', name: 'STATION CRU-L5', type: 'Station', baseTechLevel: 0.5, baseWealth: 0.6, security: 'Monitored' },
        'area18': { id: 'area18', name: 'AREA 18 (ARCCORP)', type: 'City', baseTechLevel: 0.8, baseWealth: 0.9, security: 'Armistice' },
        'grim_hex': { id: 'grim_hex', name: 'GRIM HEX (YELA)', type: 'Outpost - Lawless', baseTechLevel: 0.3, baseWealth: 0.4, security: 'No Security' },
    };

    const commodityDefinitions = { // Added base_price for market indicator logic
        'waste':      { id: 'waste', name: 'DÉCHETS', category: 'Matériaux Bruts', base_price: 9, scu_per_unit: 1, base_spoil_time_days: Infinity, icon: '🗑️' },
        'scrap':      { id: 'scrap', name: 'FERRAILLE', category: 'Matériaux Bruts', base_price: 22, scu_per_unit: 1, base_spoil_time_days: Infinity, icon: '⚙️' },
        'gold':       { id: 'gold', name: 'OR', category: 'Métaux Précieux', base_price: 4900, scu_per_unit: 1, base_spoil_time_days: Infinity, icon: '🥇' },
        'stims':      { id: 'stims', name: 'STIMULANTS', category: 'Médical', base_price: 135, scu_per_unit: 0.1, base_spoil_time_days: 2, icon: '💉' },
        'hydrogen':   { id: 'hydrogen', name: 'HYDROGÈNE', category: 'Gaz', base_price: 75, scu_per_unit: 1, base_spoil_time_days: Infinity, icon: '💨' },
        'quantanium': { id: 'quantanium', name: 'QUANTANIUM BRUT', category: 'Minerais Exotiques', base_price: 90, scu_per_unit: 1, base_spoil_time_days: 0.25, icon: '💥Q' },
        'medpens':    { id: 'medpens', name: 'MEDPENS', category: 'Médical', base_price: 70, scu_per_unit: 0.02, base_spoil_time_days: 180, icon: '➕' },
        'maze':       { id: 'maze', name: 'MAZE (DROGUE)', category: 'Narcotiques', base_price: 2750, scu_per_unit: 0.01, base_spoil_time_days: 90, icon: '🌿', isIllegal: true }
    };

    let playerInventory = [
        { commodityId: 'stims', quantity: 20, acquiredTime: new Date(Date.UTC(2953, 0, 1, 8, 0, 0)) },
        { commodityId: 'gold', quantity: 2, acquiredTime: new Date(Date.UTC(2953, 0, 1, 9, 0, 0)) },
    ];
    
    let marketStock = { // Prices here are what the SHOP SELLS FOR / BUYS FOR FROM PLAYER
        'cru_l5': { 
            'waste':      { current_sell_price: 10,  current_buy_price: 7,   current_stock: 500, base_stock: 1000, demandFactor: 0.01, supplyFactor: 0.02 },
            'scrap':      { current_sell_price: 25,  current_buy_price: 18,  current_stock: 300, base_stock: 800, demandFactor: 0.01, supplyFactor: 0.015 },
            'gold':       { current_sell_price: 5000,current_buy_price: 4750,current_stock: 20,  base_stock: 100, demandFactor: 0.005, supplyFactor: 0.002 },
            'stims':      { current_sell_price: 150, current_buy_price: 110, current_stock: 200, base_stock: 500, demandFactor: 0.02, supplyFactor: 0.01 },
            'hydrogen':   { current_sell_price: 80,  current_buy_price: 60,  current_stock: 1500,base_stock: 2000, demandFactor: 0.05, supplyFactor: 0.05 },
            'medpens':    { current_sell_price: 80,  current_buy_price: 50,  current_stock: 100, base_stock: 300, demandFactor: 0.01, supplyFactor: 0.01 },
        },
        'area18': { 
            'waste':      { current_sell_price: 9,   current_buy_price: 6,   current_stock: 200, base_stock: 500, demandFactor: 0.005, supplyFactor: 0.01 },
            'gold':       { current_sell_price: 5200,current_buy_price: 4900,current_stock: 50,  base_stock: 150, demandFactor: 0.008, supplyFactor: 0.003 },
            'stims':      { current_sell_price: 160, current_buy_price: 125, current_stock: 800, base_stock: 1000, demandFactor: 0.03, supplyFactor: 0.02 },
            'medpens':    { current_sell_price: 85,  current_buy_price: 60,  current_stock: 500, base_stock: 600, demandFactor: 0.015, supplyFactor: 0.015 },
        },
        'grim_hex': { 
            'scrap':      { current_sell_price: 28,  current_buy_price: 20,  current_stock: 150, base_stock: 300, demandFactor: 0.01, supplyFactor: 0.01 },
            'stims':      { current_sell_price: 200, current_buy_price: 170, current_stock: 50,  base_stock: 100, demandFactor: 0.01, supplyFactor: 0.005 },
            'maze':       { current_sell_price: 3500,current_buy_price: 2700,current_stock: 30,  base_stock: 50, demandFactor: 0.05, supplyFactor: 0.03, isIllegal: true },
            'quantanium': { current_sell_price: 120, current_buy_price: 90,  current_stock: 10,  base_stock: 15, demandFactor: 0.002, supplyFactor: 0.001 },
        }
    };
    // FIN DES STRUCTURES DE DONNÉES À COPIER


    const eventTemplates = {
        'boom_stims': { 
            id: 'boom_stims', name: 'Boom des Stimulants', durationHours: 48, 
            message: (loc) => `Alerte Marché ! Forte demande de STIMULANTS à ${loc}. Prix d'achat augmentés !`,
            effects: (marketData, commodityId) => {
                if (commodityId === 'stims' && marketData) {
                    marketData.current_buy_price = Math.round(commodityDefinitions.stims.base_price * 1.8); // Shop buys high
                    marketData.demandFactor *= 3;
                }
            },
            clearEffects: (marketData, commodityId) => { // Resets to base fluctuation logic
                 if (commodityId === 'stims' && marketData) {
                    marketData.demandFactor /= 3;
                    // Price will naturally readjust via simulateMarketFluctuations
                }
            }
        }
        // Add more event templates here
    };


    // --- Fonctions de Calcul ---
    function calculateCurrentCargoSCU() {
        return playerInventory.reduce((totalSCU, item) => {
            const def = commodityDefinitions[item.commodityId];
            return totalSCU + (item.quantity * (def ? def.scu_per_unit : 0));
        }, 0);
    }
    
    // --- Fonctions de Rendu ---
    function renderPlayerBalance() { playerBalanceEl.textContent = `${Math.round(gameState.balance).toLocaleString()} ESI`; }
    function formatGameTime(date) {
        const year = date.getUTCFullYear(); const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0'); const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `YT ${year}-${month}-${day} ${hours}:${minutes}`;
    }
    function renderGameTime() { gameTimeDisplayEl.textContent = `Game Time: ${formatGameTime(gameState.gameTime)}`; }
    function formatSpoilTime(msRemaining) { /* ... (Identique à v0.2) ... */ 
        if (msRemaining <= 0) return '<span class="perished-text">PERISHED</span>';
        const totalSeconds = Math.floor(msRemaining / 1000); const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600); const minutes = Math.floor((totalSeconds % 3600) / 60);
        let parts = []; if (days > 0) parts.push(`${days}d`); if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0 || (days === 0 && hours === 0)) parts.push(`${minutes}m`);
        return `<span class="spoil-time">${parts.join(' ')} left</span>`;
    }
    function renderCurrentShipAndCargo() { /* ... (Identique à v0.2) ... */ 
        const ship = shipData[gameState.currentShipId]; currentShipNameEl.textContent = ship ? ship.name : 'N/A';
        const currentSCU = calculateCurrentCargoSCU().toFixed(2); const maxSCU = ship ? ship.cargo_capacity_scu : 0;
        currentCargoDisplayEl.textContent = `${currentSCU} / ${maxSCU} SCU`;
    }

    function renderPlayerInventory() { /* ... (Adapté pour les nouveaux messages/statuts) ... */
        playerInventoryListEl.innerHTML = '';
        if (playerInventory.length === 0) { playerInventoryListEl.innerHTML = '<p class="placeholder-text">Player inventory is empty.</p>'; renderCurrentShipAndCargo(); return; }
        playerInventory.forEach((item, index) => {
            const def = commodityDefinitions[item.commodityId]; if (!def) return;
            const shopAtCurrentLocation = marketStock[gameState.currentLocationId];
            const shopBuysThisItem = shopAtCurrentLocation && shopAtCurrentLocation[item.commodityId];
            const sellPrice = shopBuysThisItem ? shopAtCurrentLocation[item.commodityId].current_buy_price : 0;

            const itemEl = document.createElement('div'); itemEl.className = 'inventory-item';
            if (item.isPerished) itemEl.classList.add('perished');
            let spoilTimeHtml = '';
            if (def.base_spoil_time_days !== Infinity) { /* ... (logique de spoil time) ... */ 
                 if (item.isPerished) { spoilTimeHtml = formatSpoilTime(0); } else {
                    const spoilTimeMs = def.base_spoil_time_days * 24 * 60 * 60 * 1000;
                    const timeElapsedMs = gameState.gameTime.getTime() - item.acquiredTime.getTime();
                    const msRemaining = spoilTimeMs - timeElapsedMs;
                    spoilTimeHtml = formatSpoilTime(msRemaining);
                }
            }
            let statusBadges = ''; if (def.isIllegal) statusBadges += `<span class="item-status illegal">ILLEGAL</span>`;
            if (def.base_spoil_time_days !== Infinity && !item.isPerished) statusBadges += `<span class="item-status perishable">PERISHABLE</span>`;
            itemEl.innerHTML = `
                <div class="item-icon">${def.icon || '[?]'}</div>
                <div class="item-details">
                    <div class="item-row"><span class="item-name">${def.name}</span>${statusBadges}</div>
                    <div class="item-info-line">Quantity: <strong>${item.quantity}</strong> (SCU: ${(item.quantity * def.scu_per_unit).toFixed(2)})</div>
                    <div class="item-info-line">Sell Price/Unit: <strong>${sellPrice > 0 ? sellPrice.toLocaleString() : 'N/A'} ESI</strong> ${spoilTimeHtml}</div>
                </div>
                <div class="item-actions">
                    <button class="sell-button" data-index="${index}" ${item.isPerished || sellPrice <= 0 || gameState.isTransactionInProgress ? 'disabled' : ''}>Sell Max</button>
                </div>`;
            playerInventoryListEl.appendChild(itemEl);
        });
        document.querySelectorAll('.sell-button').forEach(button => button.addEventListener('click', handleSellItem));
        renderCurrentShipAndCargo();
    }

    function renderShopInventory() { /* ... (Adapté pour indicateurs de marché) ... */
        shopInstockListEl.innerHTML = ''; shopOutofstockListEl.innerHTML = '';
        const currentShopMarket = marketStock[gameState.currentLocationId];
        shopLocationNameEl.textContent = locationData[gameState.currentLocationId]?.name || 'N/A';
        marketOverviewLocationNameEl.textContent = locationData[gameState.currentLocationId]?.name || 'N/A';


        if (!currentShopMarket) { /* ... (placeholder si pas de données de marché) ... */
            shopInstockListEl.innerHTML = '<p class="placeholder-text">No market data for this location.</p>';
            shopOutofstockListEl.innerHTML = ''; return;
        }
        let hasInStock = false; let hasOutOfStock = false;
        Object.values(commodityDefinitions).forEach(def => {
            const shopItemData = currentShopMarket[def.id];
            const stock = shopItemData ? Math.floor(shopItemData.current_stock) : 0;
            const sellPrice = shopItemData ? shopItemData.current_sell_price : 0; // Shop sells to player
            const buyPrice = shopItemData ? shopItemData.current_buy_price : 0; // Shop buys from player

            const itemEl = document.createElement('div'); itemEl.className = 'shop-item';
            let statusBadges = ''; if (def.isIllegal) statusBadges += `<span class="item-status illegal">ILLEGAL</span>`;
            if (def.base_spoil_time_days !== Infinity) statusBadges += `<span class="item-status perishable">PERISHABLE</span>`;
            
            let marketIndicatorsHTML = '';
            if (shopItemData) {
                if (sellPrice > 0 && sellPrice < def.base_price * 0.85) marketIndicatorsHTML += `<span class="market-indicator price-good">Good Deal!</span>`;
                if (sellPrice > 0 && sellPrice > def.base_price * 1.25) marketIndicatorsHTML += `<span class="market-indicator price-bad">Expensive</span>`;
                if (stock > 0 && stock < (shopItemData.base_stock || def.base_price * 10) * 0.2) marketIndicatorsHTML += `<span class="market-indicator stock-low">Low Stock</span>`;
            }

            itemEl.innerHTML = `
                <div class="item-icon">${def.icon || '[?]'}</div>
                <div class="item-details">
                    <div class="item-row"><span class="item-name">${def.name}</span><div class="item-statuses">${statusBadges}${marketIndicatorsHTML}</div></div>
                    <div class="item-info-line">Shop Sells For: <strong>${sellPrice > 0 ? sellPrice.toLocaleString() : 'N/A'} ESI</strong></div>
                    <div class="item-info-line">Shop Buys For: <strong>${buyPrice > 0 ? buyPrice.toLocaleString() : 'N/A'} ESI</strong></div>
                    <div class="item-info-line">Stock: <strong>${stock}</strong></div>
                </div>
                <div class="item-actions">
                    <input type="number" class="buy-quantity" value="1" min="1" max="${stock}" ${stock === 0 || sellPrice <= 0 || gameState.isTransactionInProgress ? 'disabled' : ''}>
                    <button class="buy-button" data-id="${def.id}" ${stock === 0 || sellPrice <= 0 || gameState.isTransactionInProgress ? 'disabled' : ''}>Buy</button>
                </div>`;
            if (stock > 0 && sellPrice > 0) { shopInstockListEl.appendChild(itemEl); hasInStock = true; }
            else { /* ... (gestion out of stock) ... */ 
                itemEl.classList.add('perished'); itemEl.querySelector('.buy-quantity').disabled = true;
                itemEl.querySelector('.buy-button').disabled = true; shopOutofstockListEl.appendChild(itemEl); hasOutOfStock = true;
            }
        });
        if (!hasInStock) shopInstockListEl.innerHTML = '<p class="placeholder-text">No items currently available for purchase.</p>';
        if (!hasOutOfStock) shopOutofstockListEl.innerHTML = '<p class="placeholder-text">No items out of stock or not sold here.</p>';
        document.querySelectorAll('.buy-button').forEach(button => button.addEventListener('click', handleBuyItem));
    }

    function renderLocalMarketOverview() {
        marketOverviewListEl.innerHTML = '';
        const currentShopMarket = marketStock[gameState.currentLocationId];
         marketOverviewLocationNameEl.textContent = locationData[gameState.currentLocationId]?.name || 'N/A';

        Object.values(commodityDefinitions).forEach(def => {
            const shopItemData = currentShopMarket ? currentShopMarket[def.id] : null;
            const sellPrice = shopItemData ? shopItemData.current_sell_price : 'N/A';
            const buyPrice = shopItemData ? shopItemData.current_buy_price : 'N/A';
            const stock = shopItemData ? Math.floor(shopItemData.current_stock) : 'N/A';

            const itemEl = document.createElement('div');
            itemEl.className = 'market-overview-item';
            itemEl.innerHTML = `
                <div class="item-icon">${def.icon || '[?]'}</div>
                <div class="item-details">
                    <span class="item-name">${def.name} ${def.isIllegal ? '<span class="item-status illegal">ILLEGAL</span>':''}</span>
                    <div class="market-price-info">
                        <span>Shop Sells: <strong>${typeof sellPrice === 'number' ? sellPrice.toLocaleString() : sellPrice} ESI</strong></span>
                        <span>Shop Buys: <strong>${typeof buyPrice === 'number' ? buyPrice.toLocaleString() : buyPrice} ESI</strong></span>
                        <span>Stock: <strong>${stock}</strong></span>
                    </div>
                </div>`;
            marketOverviewListEl.appendChild(itemEl);
        });
    }


    function showTransactionStatus(message, duration = 3000, type = 'info') { // type can be 'info', 'success', 'error'
        transactionStatusEl.textContent = message;
        transactionStatusEl.className = 'transaction-status-bar visible'; // Reset classes
        if (type === 'error') transactionStatusEl.classList.add('error');
        else if (type === 'success') transactionStatusEl.classList.add('success');
        
        gameState.isTransactionInProgress = (type === 'info'); // Only block for info (pending transactions)
        renderAllUI(); 

        if (type !== 'info' || duration > 0) { // Auto-hide for success/error or if duration specified
            setTimeout(() => {
                if (transactionStatusEl.textContent === message) { // Hide only if message hasn't changed
                    transactionStatusEl.classList.remove('visible', 'error', 'success');
                    transactionStatusEl.textContent = '';
                }
                if (gameState.isTransactionInProgress && type==='info') { // Re-enable buttons if it was a pending transaction
                     gameState.isTransactionInProgress = false;
                     renderAllUI();
                }
            }, duration);
        }
    }
    
    function renderEventBanner() {
        if (gameState.activeEvents.length > 0) {
            const currentEvent = gameState.activeEvents.find(ev => ev.locationId === gameState.currentLocationId);
            if (currentEvent) {
                const timeRemainingMs = currentEvent.endTime.getTime() - gameState.gameTime.getTime();
                const hoursRemaining = Math.floor(timeRemainingMs / (1000 * 60 * 60));
                const minutesRemaining = Math.floor((timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60));
                eventBannerEl.textContent = `${currentEvent.message(locationData[currentEvent.locationId].name)} (Ends in: ${hoursRemaining}h ${minutesRemaining}m)`;
                eventBannerEl.classList.add('visible');
            } else {
                eventBannerEl.classList.remove('visible');
                eventBannerEl.textContent = '';
            }
        } else {
            eventBannerEl.classList.remove('visible');
            eventBannerEl.textContent = '';
        }
    }


    function renderAllUI() {
        renderPlayerBalance(); renderGameTime(); renderPlayerInventory(); 
        renderShopInventory(); renderLocalMarketOverview(); renderEventBanner();
    }

    // --- Logique de Jeu ---
    function updateGameTime() { /* ... (Identique à v0.2, mais appelle checkAndClearEvents) ... */
        const now = Date.now(); const realTimeElapsedMs = now - gameState.lastRealTimeUpdate;
        if (realTimeElapsedMs < 200) return; // Throttle slightly more
        const gameTimeElapsedMs = realTimeElapsedMs * (gameState.gameTimeSpeedFactor / 1000);
        gameState.gameTime = new Date(gameState.gameTime.getTime() + gameTimeElapsedMs);
        gameState.lastRealTimeUpdate = now;

        checkSpoilage(); 
        applyActiveEvents(); // Apply effects before market sim
        simulateMarketFluctuations();
        checkAndTriggerEvents(); // Check for new events
        checkAndClearEvents(); // Check for expired events
        
        renderGameTime(); 
        if (Math.random() < 0.2) { renderAllUI(); } // More frequent full UI updates for market changes
    }
    function checkSpoilage() { /* ... (Identique à v0.2) ... */
        playerInventory.forEach(item => { if (item.isPerished) return; 
            const def = commodityDefinitions[item.commodityId]; if (def.base_spoil_time_days === Infinity) return;
            const spoilTimeMs = def.base_spoil_time_days * 24 * 60 * 60 * 1000;
            const timeElapsedMs = gameState.gameTime.getTime() - item.acquiredTime.getTime();
            if (timeElapsedMs >= spoilTimeMs) { console.log(`${def.name} x${item.quantity} has perished!`); item.isPerished = true; }
        });
    }
    function simulateMarketFluctuations() { /* ... (Identique à v0.2, mais s'assure d'avoir def) ... */ 
        const currentShop = marketStock[gameState.currentLocationId]; if (!currentShop) return;
        for (const itemId in currentShop) {
            const itemMarketData = currentShop[itemId]; const def = commodityDefinitions[itemId]; if(!def) continue;
            let stockChange = (itemMarketData.base_stock - itemMarketData.current_stock) * (itemMarketData.demandFactor || 0.01) * 0.005; // Reduced impact
            stockChange -= (itemMarketData.supplyFactor || 0.01) * itemMarketData.base_stock * 0.001; // Reduced impact
            itemMarketData.current_stock = Math.max(0, itemMarketData.current_stock + stockChange);
            if (itemMarketData.current_stock > itemMarketData.base_stock * 2) itemMarketData.current_stock = itemMarketData.base_stock * 2;
            itemMarketData.current_stock = Math.round(itemMarketData.current_stock);

            const stockRatio = Math.max(0.1, itemMarketData.current_stock / itemMarketData.base_stock); 
            let priceModifier = 1;
            if (stockRatio < 0.5) priceModifier = 1 + (0.5 - stockRatio) * 0.8; 
            else if (stockRatio > 1.5) priceModifier = Math.max(0.3, 1 - (stockRatio - 1.5) * 0.4);
            
            // Temporarily store original base price for event resets
            if (!itemMarketData.original_sell_price) itemMarketData.original_sell_price = def.base_price * 1.1; // Approx shop sell
            if (!itemMarketData.original_buy_price) itemMarketData.original_buy_price = def.base_price * 0.9; // Approx shop buy

            itemMarketData.current_sell_price = Math.max(1, Math.round(itemMarketData.original_sell_price * priceModifier));
            itemMarketData.current_buy_price = Math.max(1, Math.round(itemMarketData.original_buy_price * priceModifier));
            itemMarketData.current_buy_price = Math.min(itemMarketData.current_buy_price, Math.round(itemMarketData.current_sell_price * 0.95));
        }
    }
    function calculateTransactionTime(quantity, scuPerUnit) { /* ... (Identique à v0.2) ... */
        const totalScu = quantity * scuPerUnit; const ship = shipData[gameState.currentShipId];
        const shipLoadTimePerScu = ship ? ship.base_manual_load_time_per_scu : 30;
        let actualDelayMs = Math.max(300, totalScu * shipLoadTimePerScu * 5); 
        if (actualDelayMs > 3000) actualDelayMs = 3000; return actualDelayMs;
    }

    // --- Event Logic ---
    function applyActiveEvents() {
        const currentShop = marketStock[gameState.currentLocationId];
        if (!currentShop) return;

        // First, reset any previous event effects for items in this location to avoid stacking/permanent changes
        for (const commodityId in currentShop) {
            const marketItem = currentShop[commodityId];
            const def = commodityDefinitions[commodityId];
            if (marketItem.original_sell_price) marketItem.current_sell_price = marketItem.original_sell_price; else if(def) marketItem.current_sell_price = def.base_price * 1.1;
            if (marketItem.original_buy_price) marketItem.current_buy_price = marketItem.original_buy_price; else if(def) marketItem.current_buy_price = def.base_price * 0.9;
            if (marketItem.original_demandFactor) marketItem.demandFactor = marketItem.original_demandFactor;
        }


        gameState.activeEvents.forEach(event => {
            if (event.locationId === gameState.currentLocationId || event.locationId === 'global') {
                const template = eventTemplates[event.eventId];
                if (template) {
                    if (event.commodityId) { // Event targets a specific commodity
                        if (currentShop[event.commodityId]) {
                             if (!currentShop[event.commodityId].original_demandFactor) currentShop[event.commodityId].original_demandFactor = currentShop[event.commodityId].demandFactor;
                            template.effects(currentShop[event.commodityId], event.commodityId);
                        }
                    } else { // Event targets all commodities or is non-commodity specific
                        Object.keys(currentShop).forEach(commodityId => {
                            if (!currentShop[commodityId].original_demandFactor) currentShop[commodityId].original_demandFactor = currentShop[commodityId].demandFactor;
                            template.effects(currentShop[commodityId], commodityId); // Pass commodityId for specific item logic within effect
                        });
                    }
                }
            }
        });
    }


    function checkAndTriggerEvents() {
        if (gameState.activeEvents.some(ev => ev.locationId === gameState.currentLocationId)) return; // Don't stack events in same location for now

        if (Math.random() < 0.005) { // Low chance to trigger an event each time tick
            const eventTemplate = eventTemplates['boom_stims']; // Example
            const newEvent = {
                eventId: eventTemplate.id,
                locationId: gameState.currentLocationId, // Affect current location
                commodityId: 'stims', // This event is for stims
                startTime: new Date(gameState.gameTime.getTime()),
                endTime: new Date(gameState.gameTime.getTime() + eventTemplate.durationHours * 60 * 60 * 1000),
                message: eventTemplate.message
            };
            gameState.activeEvents.push(newEvent);
            console.log(`Event triggered: ${eventTemplate.name} at ${locationData[newEvent.locationId].name}`);
            showTransactionStatus(newEvent.message(locationData[newEvent.locationId].name), 5000, 'info');
            applyActiveEvents(); // Apply immediately
            renderEventBanner();
        }
    }

    function checkAndClearEvents() {
        const previousEventCount = gameState.activeEvents.length;
        gameState.activeEvents = gameState.activeEvents.filter(event => {
            if (gameState.gameTime.getTime() >= event.endTime.getTime()) {
                console.log(`Event ended: ${eventTemplates[event.eventId].name} at ${locationData[event.locationId].name}`);
                const template = eventTemplates[event.eventId];
                 if (template.clearEffects) {
                    const currentShop = marketStock[event.locationId];
                    if(currentShop) {
                        if (event.commodityId) {
                            if(currentShop[event.commodityId]) template.clearEffects(currentShop[event.commodityId], event.commodityId);
                        } else {
                             Object.keys(currentShop).forEach(commodityId => {
                                template.clearEffects(currentShop[commodityId], commodityId);
                            });
                        }
                    }
                }
                return false;
            }
            return true;
        });
        if (gameState.activeEvents.length !== previousEventCount) {
             applyActiveEvents(); // Re-apply remaining or default state
             renderEventBanner();
        }
    }


    // --- Transaction Logic --- (handleSellItem, handleBuyItem adaptés pour showTransactionStatus avec type)
    function handleSellItem(event) { /* ... (Modifié pour utiliser showTransactionStatus avec type 'success'/'error') ... */
        if (gameState.isTransactionInProgress) return; const itemIndex = parseInt(event.target.dataset.index);
        const itemToSell = playerInventory[itemIndex]; if (!itemToSell || itemToSell.isPerished) { showTransactionStatus("Cannot sell perished item.", 2000, 'error'); return; }
        const def = commodityDefinitions[itemToSell.commodityId]; const shopMarket = marketStock[gameState.currentLocationId];
        const shopStockInfo = shopMarket ? shopMarket[itemToSell.commodityId] : null;
        if (!shopStockInfo || shopStockInfo.current_buy_price <= 0) { showTransactionStatus(`Shop does not buy ${def.name} here.`, 2000, 'error'); return; }
        const sellPrice = shopStockInfo.current_buy_price; const quantityToSell = itemToSell.quantity; const totalValue = quantityToSell * sellPrice;
        const transactionTime = calculateTransactionTime(quantityToSell, def.scu_per_unit);
        const gameTimeForTransaction = Math.round(transactionTime * gameState.gameTimeSpeedFactor / 1000);

        showTransactionStatus(`Selling ${quantityToSell} ${def.name}... (ETA: ${formatGameTime(new Date(gameState.gameTime.getTime() + gameTimeForTransaction))})`, transactionTime, 'info');
        setTimeout(() => {
            gameState.balance += totalValue; playerInventory.splice(itemIndex, 1); shopStockInfo.current_stock += quantityToSell;
            console.log(`Sold ${quantityToSell} ${def.name} for ${totalValue} ESI.`);
            showTransactionStatus(`Sold ${quantityToSell} ${def.name} for ${totalValue.toLocaleString()} ESI.`, 3000, 'success');
        }, transactionTime);
    }
    function handleBuyItem(event) { /* ... (Modifié pour utiliser showTransactionStatus avec type 'success'/'error') ... */
        if (gameState.isTransactionInProgress) return; const commodityId = event.target.dataset.id;
        const quantityInput = event.target.closest('.item-actions').querySelector('.buy-quantity'); const quantityToBuy = parseInt(quantityInput.value);
        if (isNaN(quantityToBuy) || quantityToBuy <= 0) { showTransactionStatus("Please enter a valid quantity.", 2000, 'error'); return; }
        const def = commodityDefinitions[commodityId]; const shopMarket = marketStock[gameState.currentLocationId];
        const shopStockInfo = shopMarket ? shopMarket[commodityId] : null; const currentShip = shipData[gameState.currentShipId];
        if (!def || !shopStockInfo || shopStockInfo.current_stock < quantityToBuy || shopStockInfo.current_sell_price <= 0) { showTransactionStatus("Not enough stock or item unavailable.", 2000, 'error'); return; }
        const itemSCU = quantityToBuy * def.scu_per_unit; const currentCargoLoad = calculateCurrentCargoSCU();
        if (currentCargoLoad + itemSCU > currentShip.cargo_capacity_scu) { showTransactionStatus(`Not enough cargo. Available: ${(currentShip.cargo_capacity_scu - currentCargoLoad).toFixed(2)} SCU. Needs: ${itemSCU.toFixed(2)} SCU.`, 3000, 'error'); return; }
        const totalPrice = quantityToBuy * shopStockInfo.current_sell_price; if (gameState.balance < totalPrice) { showTransactionStatus("Not enough ESI.", 2000, 'error'); return; }
        const transactionTime = calculateTransactionTime(quantityToBuy, def.scu_per_unit);
        const gameTimeForTransaction = Math.round(transactionTime * gameState.gameTimeSpeedFactor / 1000);
        showTransactionStatus(`Buying ${quantityToBuy} ${def.name}... (ETA: ${formatGameTime(new Date(gameState.gameTime.getTime() + gameTimeForTransaction))})`, transactionTime, 'info');
        setTimeout(() => {
            gameState.balance -= totalPrice; shopStockInfo.current_stock -= quantityToBuy;
            const existingItem = playerInventory.find(item => item.commodityId === commodityId && !item.isPerished);
            if (existingItem) { existingItem.quantity += quantityToBuy; } else { playerInventory.push({ commodityId: commodityId, quantity: quantityToBuy, acquiredTime: new Date(gameState.gameTime.getTime()) }); }
            console.log(`Bought ${quantityToBuy} ${def.name} for ${totalPrice} ESI.`);
            showTransactionStatus(`Bought ${quantityToBuy} ${def.name} for ${totalPrice.toLocaleString()} ESI.`, 3000, 'success');
        }, transactionTime);
    }
    
    // --- Save/Load Logic ---
    function saveGame() {
        try {
            const saveData = {
                gameState: { ...gameState, gameTime: gameState.gameTime.toISOString() }, // Convert Date to ISO string
                playerInventory: playerInventory.map(item => ({...item, acquiredTime: item.acquiredTime.toISOString()})),
                marketStock // Save current market state too for consistency on load
            };
            localStorage.setItem('commoditiesSimSave_v0.3', JSON.stringify(saveData));
            showTransactionStatus('Progression sauvegardée !', 2000, 'success');
        } catch (e) {
            console.error("Error saving game:", e);
            showTransactionStatus('Erreur lors de la sauvegarde.', 2000, 'error');
        }
    }

    function loadGame() {
        try {
            const savedDataString = localStorage.getItem('commoditiesSimSave_v0.3');
            if (savedDataString) {
                const loadedData = JSON.parse(savedDataString);
                // gameState = { ...loadedData.gameState, gameTime: new Date(loadedData.gameState.gameTime) }; // Restore Date object
                // Manually assign to keep reference for interval
                Object.assign(gameState, loadedData.gameState);
                gameState.gameTime = new Date(loadedData.gameState.gameTime);
                gameState.lastRealTimeUpdate = Date.now(); // Reset real time update marker

                playerInventory = loadedData.playerInventory.map(item => ({...item, acquiredTime: new Date(item.acquiredTime)}));
                marketStock = loadedData.marketStock; // Restore market
                
                locationSelectEl.value = gameState.currentLocationId; // Update selector
                applyActiveEvents(); // Re-apply events based on loaded state
                renderAllUI();
                showTransactionStatus('Progression chargée !', 2000, 'success');
            } else {
                showTransactionStatus('Aucune sauvegarde trouvée.', 2000, 'info');
            }
        } catch (e) {
            console.error("Error loading game:", e);
            showTransactionStatus('Erreur lors du chargement.', 2000, 'error');
        }
    }

    // --- Event Listeners ---
    tabButtons.forEach(button => { /* ... (Identique à v0.2) ... */ 
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active')); tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active'); document.getElementById(`${button.dataset.tab}-content`).classList.add('active');
            if (button.dataset.tab === 'market-value') renderLocalMarketOverview(); // Refresh on tab click
        });
    });
    locationSelectEl.addEventListener('change', (event) => { /* ... (Identique à v0.2) ... */
        gameState.currentLocationId = event.target.value; console.log(`Location changed to: ${gameState.currentLocationId}`);
        applyActiveEvents(); // Apply events for new location before full render
        renderAllUI(); 
    });
    saveGameButton.addEventListener('click', saveGame);
    loadGameButton.addEventListener('click', loadGame);

    // --- Initialisation ---
    function init() {
        populateLocationSelector();
        loadGame(); // Try to load saved game first
        applyActiveEvents(); // Apply events based on initial/loaded state
        renderAllUI();
        setInterval(updateGameTime, 1000); // Main game loop
        console.log("Commodities Terminal SIM v0.3 Initialized.");
    }
    
    function populateLocationSelector() { /* ... (Identique à v0.2) ... */
        Object.values(locationData).forEach(loc => { const option = document.createElement('option');
            option.value = loc.id; option.textContent = loc.name; locationSelectEl.appendChild(option);
        });
        locationSelectEl.value = gameState.currentLocationId;
    }

    init();
});