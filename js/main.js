// ===== MAIN JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initMap();
    initCookieBanner();
    initStatsCounter();
    initContactForm();
    initNewsFilters();
    initPartnerFilters();
});

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navExternal = document.querySelector('.nav-external');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navExternal.classList.toggle('active');
            
            // Toggle icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
}

// ===== MAP INITIALIZATION =====
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Initialize map centered on La Réunion
    const map = L.map('map').setView([-21.1151, 55.5364], 10);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Custom icon for Cliiink bornes
    const borneIcon = L.divIcon({
        className: 'borne-marker',
        html: '<div style="background-color: #00A86B; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"><i class="fas fa-recycle" style="color: white; font-size: 14px;"></i></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    const maintenanceIcon = L.divIcon({
        className: 'borne-marker',
        html: '<div style="background-color: #FDCB6E; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"><i class="fas fa-tools" style="color: white; font-size: 14px;"></i></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    // Sample bornes data for La Réunion
    const bornes = [
        { lat: -20.8789, lng: 55.4481, name: "Borne Saint-Denis Centre", address: "Rue Maréchal Leclerc, Saint-Denis", status: "available" },
        { lat: -20.8823, lng: 55.4507, name: "Borne Barachois", address: "Barachois, Saint-Denis", status: "available" },
        { lat: -20.9077, lng: 55.5177, name: "Borne Sainte-Marie", address: "Centre-ville, Sainte-Marie", status: "available" },
        { lat: -20.9288, lng: 55.5294, name: "Borne Sainte-Suzanne", address: "Avenue de la Mer, Sainte-Suzanne", status: "maintenance" },
        { lat: -21.0073, lng: 55.2701, name: "Borne Saint-Paul", address: "Front de mer, Saint-Paul", status: "available" },
        { lat: -21.0153, lng: 55.2242, name: "Borne Saint-Gilles", address: "Rue du Général de Gaulle, Saint-Gilles", status: "available" },
        { lat: -21.1151, lng: 55.2865, name: "Borne Saint-Leu", address: "Centre commercial, Saint-Leu", status: "available" },
        { lat: -21.2716, lng: 55.3582, name: "Borne Saint-Pierre", address: "Rue des Bons Enfants, Saint-Pierre", status: "available" },
        { lat: -21.2426, lng: 55.3389, name: "Borne Saint-Louis", address: "Boulevard Hubert Delisle, Saint-Louis", status: "maintenance" },
        { lat: -21.3424, lng: 55.4785, name: "Borne Saint-Joseph", address: "Centre-ville, Saint-Joseph", status: "available" },
        { lat: -21.1762, lng: 55.6414, name: "Borne Saint-Benoît", address: "Place de la Mairie, Saint-Benoît", status: "available" },
        { lat: -21.2455, lng: 55.7097, name: "Borne Saint-André", address: "Rue de la Gare, Saint-André", status: "available" }
    ];
    
    // Add markers
    bornes.forEach(borne => {
        const icon = borne.status === 'available' ? borneIcon : maintenanceIcon;
        const statusText = borne.status === 'available' ? 'Disponible' : 'En maintenance';
        const statusColor = borne.status === 'available' ? '#00A86B' : '#FDCB6E';
        
        const marker = L.marker([borne.lat, borne.lng], { icon: icon }).addTo(map);
        marker.bindPopup(`
            <div style="min-width: 200px;">
                <h4 style="margin: 0 0 8px 0; color: #2D3436;">${borne.name}</h4>
                <p style="margin: 0 0 8px 0; color: #636E72; font-size: 14px;">
                    <i class="fas fa-map-marker-alt" style="color: #00A86B;"></i> ${borne.address}
                </p>
                <span style="display: inline-block; padding: 4px 8px; background-color: ${statusColor}; color: white; border-radius: 4px; font-size: 12px;">
                    ${statusText}
                </span>
            </div>
        `);
    });
    
    // Geolocation button
    const geolocateBtn = document.getElementById('geolocate-btn');
    if (geolocateBtn) {
        geolocateBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const userLat = position.coords.latitude;
                        const userLng = position.coords.longitude;
                        
                        // Add user marker
                        const userIcon = L.divIcon({
                            className: 'user-marker',
                            html: '<div style="background-color: #3498db; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                        });
                        
                        L.marker([userLat, userLng], { icon: userIcon })
                            .addTo(map)
                            .bindPopup('Vous êtes ici')
                            .openPopup();
                        
                        map.setView([userLat, userLng], 13);
                    },
                    function(error) {
                        alert('Impossible de vous localiser. Veuillez vérifier vos paramètres de géolocalisation.');
                    }
                );
            } else {
                alert('La géolocalisation n\'est pas supportée par votre navigateur.');
            }
        });
    }
}

// ===== COOKIE BANNER =====
function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const refuseBtn = document.getElementById('refuse-cookies');
    
    if (!banner) return;
    
    // Check if user has already made a choice
    if (!localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);
    }
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.classList.remove('show');
        });
    }
    
    if (refuseBtn) {
        refuseBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'refused');
            banner.classList.remove('show');
        });
    }
}

// ===== STATS COUNTER ANIMATION =====
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;
    
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString('fr-FR');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.dataset.count);
                animateValue(target, 0, endValue, 2000);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

// ===== CONTACT FORM =====
function initContactForm() {
    const formTabs = document.querySelectorAll('.form-tab');
    const forms = document.querySelectorAll('.contact-form');
    
    formTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.form;
            
            // Update tabs
            formTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update forms
            forms.forEach(form => {
                form.style.display = form.id === target ? 'block' : 'none';
            });
        });
    });
    
    // Form submission
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#E74C3C';
                } else {
                    input.style.borderColor = '#E9ECEF';
                }
            });
            
            if (isValid) {
                // Show success message (in production, send to server)
                alert('Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.');
                this.reset();
            }
        });
    });
}

// ===== NEWS FILTERS =====
function initNewsFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.news-full-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            newsCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'grid';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== PARTNER FILTERS =====
function initPartnerFilters() {
    const filterBtns = document.querySelectorAll('.category-tabs .filter-btn');
    const partnerCards = document.querySelectorAll('.partner-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.category;
            
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            partnerCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
