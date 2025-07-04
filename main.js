import * as THREE from 'three';

class SolarSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        this.planets = [];
        this.sun = null;
        this.stars = null;
        this.isPaused = false;
        this.isLightTheme = false;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredPlanet = null;
        this.isPanelCollapsed = false;
        
        // Updated planet data with better visibility and realistic proportions
        this.planetData = [
            {
                name: 'Mercury',
                radius: 1.2,
                distance: 25,
                speed: 4.74,
                color: 0x8C7853,
                realDistance: '57.9 million km',
                realPeriod: '88 Earth days',
                realDiameter: '4,879 km',
                fact: 'Mercury has extreme temperature variations, from 427°C to -173°C!'
            },
            {
                name: 'Venus',
                radius: 1.8,
                distance: 35,
                speed: 3.50,
                color: 0xFFC649,
                realDistance: '108.2 million km',
                realPeriod: '225 Earth days',
                realDiameter: '12,104 km',
                fact: 'Venus rotates backwards and has the hottest surface in our solar system!'
            },
            {
                name: 'Earth',
                radius: 2.0,
                distance: 45,
                speed: 2.98,
                color: 0x6B93D6,
                realDistance: '149.6 million km',
                realPeriod: '365.25 days',
                realDiameter: '12,756 km',
                fact: 'Earth is the only known planet with life and liquid water on its surface!'
            },
            {
                name: 'Mars',
                radius: 1.6,
                distance: 55,
                speed: 2.41,
                color: 0xC1440E,
                realDistance: '227.9 million km',
                realPeriod: '687 Earth days',
                realDiameter: '6,792 km',
                fact: 'Mars has the largest volcano in the solar system - Olympus Mons!'
            },
            {
                name: 'Jupiter',
                radius: 4.5,
                distance: 75,
                speed: 1.31,
                color: 0xD8CA9D,
                realDistance: '778.5 million km',
                realPeriod: '11.9 Earth years',
                realDiameter: '142,984 km',
                fact: 'Jupiter is so massive it could contain all other planets combined!'
            },
            {
                name: 'Saturn',
                radius: 4.0,
                distance: 95,
                speed: 0.97,
                color: 0xFAD5A5,
                realDistance: '1.43 billion km',
                realPeriod: '29.5 Earth years',
                realDiameter: '120,536 km',
                fact: 'Saturn is less dense than water and has over 80 known moons!'
            },
            {
                name: 'Uranus',
                radius: 3.2,
                distance: 115,
                speed: 0.68,
                color: 0x4FD0E7,
                realDistance: '2.87 billion km',
                realPeriod: '84 Earth years',
                realDiameter: '51,118 km',
                fact: 'Uranus rotates on its side and has faint rings around it!'
            },
            {
                name: 'Neptune',
                radius: 3.0,
                distance: 135,
                speed: 0.54,
                color: 0x4B70DD,
                realDistance: '4.50 billion km',
                realPeriod: '165 Earth years',
                realDiameter: '49,528 km',
                fact: 'Neptune has the strongest winds in the solar system, up to 2,100 km/h!'
            }
        ];

        this.init();
    }

    async init() {
        try {
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupLights();
            await this.createStars();
            this.createSun();
            this.createPlanets();
            this.setupControls();
            this.setupEventListeners();
            this.animate();
            
            // Hide loading screen
            document.getElementById('loading').style.display = 'none';
        } catch (error) {
            console.error('Error initializing solar system:', error);
            document.getElementById('loading').innerHTML = '<div class="loading-text">Error loading solar system. Please refresh the page.</div>';
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        this.camera.position.set(0, 80, 200);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        const canvas = document.getElementById('solar-system-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    setupLights() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Point light from the sun
        const sunLight = new THREE.PointLight(0xffffff, 2.5, 500);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.1;
        sunLight.shadow.camera.far = 500;
        this.scene.add(sunLight);
    }

    async createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 5000;
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 1000;
            positions[i + 1] = (Math.random() - 0.5) * 1000;
            positions[i + 2] = (Math.random() - 0.5) * 1000;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.5,
            transparent: true,
            opacity: 0.8
        });

        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }

    createSun() {
        const sunGeometry = new THREE.SphereGeometry(8, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.5
        });

        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.userData = {
            name: 'Sun',
            type: 'star'
        };
        this.scene.add(this.sun);

        // Add sun glow effect
        const glowGeometry = new THREE.SphereGeometry(12, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.3
        });
        const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.sun.add(sunGlow);
    }

    createPlanets() {
        this.planetData.forEach((planetInfo, index) => {
            const planet = this.createPlanet(planetInfo);
            this.planets.push(planet);
            this.scene.add(planet.group);
        });
    }

    createPlanet(planetInfo) {
        // Create planet group for orbit
        const planetGroup = new THREE.Group();

        // Create planet geometry and material
        const geometry = new THREE.SphereGeometry(planetInfo.radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: planetInfo.color,
            shininess: 30,
            specular: 0x111111,
            emissive: planetInfo.color,
            emissiveIntensity: 0.15
        });

        const planetMesh = new THREE.Mesh(geometry, material);
        planetMesh.position.x = planetInfo.distance;
        planetMesh.castShadow = true;
        planetMesh.receiveShadow = true;

        // Add planet data for interaction
        planetMesh.userData = {
            name: planetInfo.name,
            type: 'planet',
            info: planetInfo
        };

        planetGroup.add(planetMesh);

        // Create orbit line with better visibility
        const orbitGeometry = new THREE.RingGeometry(
            planetInfo.distance - 0.2, 
            planetInfo.distance + 0.2, 
            128
        );
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0x666666,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        const orbitLine = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbitLine.rotation.x = Math.PI / 2;
        this.scene.add(orbitLine);

        return {
            group: planetGroup,
            mesh: planetMesh,
            info: planetInfo,
            angle: Math.random() * Math.PI * 2,
            baseSpeed: planetInfo.speed,
            currentSpeed: planetInfo.speed
        };
    }

    setupControls() {
        // Create planet speed controls
        const planetSlidersContainer = document.getElementById('planet-sliders');
        
        this.planets.forEach((planet, index) => {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'planet-control';
            
            controlDiv.innerHTML = `
                <div class="planet-name">
                    <div class="planet-color" style="background-color: #${planet.info.color.toString(16).padStart(6, '0')}"></div>
                    <span>${planet.info.name}</span>
                </div>
                <div class="speed-control">
                    <input type="range" class="speed-slider" min="0" max="5" step="0.1" value="${planet.currentSpeed}" data-planet="${index}">
                    <span class="speed-value">${planet.currentSpeed.toFixed(1)}x</span>
                </div>
            `;
            
            planetSlidersContainer.appendChild(controlDiv);
        });

        // Add event listeners for sliders
        document.querySelectorAll('.speed-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const planetIndex = parseInt(e.target.dataset.planet);
                const newSpeed = parseFloat(e.target.value);
                this.planets[planetIndex].currentSpeed = newSpeed;
                
                // Update display
                const valueSpan = e.target.parentElement.querySelector('.speed-value');
                valueSpan.textContent = `${newSpeed.toFixed(1)}x`;
            });
        });
    }

    setupEventListeners() {
        // Panel toggle buttons
        document.getElementById('close-panel-btn').addEventListener('click', () => {
            this.togglePanel();
        });

        document.getElementById('toggle-panel-btn').addEventListener('click', () => {
            this.togglePanel();
        });

        // Pause/Resume button
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.togglePause();
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetSimulation();
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Mouse events for planet interaction
        window.addEventListener('mousemove', (event) => {
            this.onMouseMove(event);
        });

        window.addEventListener('click', (event) => {
            this.onMouseClick(event);
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });

        // Keyboard controls
        window.addEventListener('keydown', (event) => {
            this.onKeyDown(event);
        });
    }

    togglePanel() {
        this.isPanelCollapsed = !this.isPanelCollapsed;
        const controlPanel = document.getElementById('control-panel');
        const toggleBtn = document.getElementById('toggle-panel-btn');

        if (this.isPanelCollapsed) {
            controlPanel.classList.add('collapsed');
            toggleBtn.classList.add('visible');
        } else {
            controlPanel.classList.remove('collapsed');
            toggleBtn.classList.remove('visible');
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pause-btn');
        
        if (this.isPaused) {
            pauseBtn.textContent = '▶️ Resume';
            pauseBtn.classList.add('paused');
        } else {
            pauseBtn.textContent = '⏸️ Pause';
            pauseBtn.classList.remove('paused');
        }
    }

    resetSimulation() {
        // Reset all planet positions and speeds
        this.planets.forEach((planet, index) => {
            planet.angle = Math.random() * Math.PI * 2;
            planet.currentSpeed = planet.baseSpeed;
            
            // Reset slider values
            const slider = document.querySelector(`[data-planet="${index}"]`);
            const valueSpan = slider.parentElement.querySelector('.speed-value');
            slider.value = planet.baseSpeed;
            valueSpan.textContent = `${planet.baseSpeed.toFixed(1)}x`;
        });

        // Reset camera position
        this.camera.position.set(0, 80, 200);
        this.camera.lookAt(0, 0, 0);
    }

    toggleTheme() {
        this.isLightTheme = !this.isLightTheme;
        const themeBtn = document.getElementById('theme-toggle');
        
        if (this.isLightTheme) {
            document.body.style.background = '#f0f0f0';
            document.body.style.color = '#000000';
            this.scene.background = new THREE.Color(0xf0f0f0);
            themeBtn.textContent = '☀️ Light';
        } else {
            document.body.style.background = '#0a0a0a';
            document.body.style.color = '#ffffff';
            this.scene.background = new THREE.Color(0x000000);
            themeBtn.textContent = '🌙 Dark';
        }
    }

    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Check for intersections with planets
        const planetMeshes = this.planets.map(p => p.mesh);
        const intersects = this.raycaster.intersectObjects(planetMeshes);

        if (intersects.length > 0) {
            const intersectedPlanet = intersects[0].object;
            
            if (this.hoveredPlanet !== intersectedPlanet) {
                this.hoveredPlanet = intersectedPlanet;
                this.showPlanetInfo(intersectedPlanet.userData.info);
                document.body.style.cursor = 'pointer';
            }
        } else {
            if (this.hoveredPlanet) {
                this.hoveredPlanet = null;
                this.hidePlanetInfo();
                document.body.style.cursor = 'default';
            }
        }
    }

    onMouseClick(event) {
        if (this.hoveredPlanet) {
            // Zoom to planet
            const planetPosition = this.hoveredPlanet.getWorldPosition(new THREE.Vector3());
            const distance = 30;
            
            this.camera.position.set(
                planetPosition.x + distance,
                planetPosition.y + 15,
                planetPosition.z + distance
            );
            this.camera.lookAt(planetPosition);
        }
    }

    showPlanetInfo(planetInfo) {
        const infoPanel = document.getElementById('info-panel');
        const planetColor = document.querySelector('.info-planet-color');
        const planetName = document.getElementById('info-planet-name');
        const distance = document.getElementById('info-distance');
        const period = document.getElementById('info-period');
        const diameter = document.getElementById('info-diameter');
        const fact = document.getElementById('info-fact');

        planetColor.style.backgroundColor = `#${planetInfo.color.toString(16).padStart(6, '0')}`;
        planetName.textContent = planetInfo.name;
        distance.textContent = planetInfo.realDistance;
        period.textContent = planetInfo.realPeriod;
        diameter.textContent = planetInfo.realDiameter;
        fact.textContent = planetInfo.fact;

        infoPanel.classList.add('visible');
    }

    hidePlanetInfo() {
        const infoPanel = document.getElementById('info-panel');
        infoPanel.classList.remove('visible');
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                this.togglePause();
                break;
            case 'KeyR':
                this.resetSimulation();
                break;
            case 'KeyT':
                this.toggleTheme();
                break;
            case 'KeyC':
                this.togglePanel();
                break;
            case 'ArrowUp':
                this.camera.position.y += 10;
                break;
            case 'ArrowDown':
                this.camera.position.y -= 10;
                break;
            case 'ArrowLeft':
                this.camera.position.x -= 10;
                break;
            case 'ArrowRight':
                this.camera.position.x += 10;
                break;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.isPaused) {
            const deltaTime = this.clock.getDelta();

            // Rotate sun
            if (this.sun) {
                this.sun.rotation.y += deltaTime * 0.5;
            }

            // Animate planets
            this.planets.forEach(planet => {
                // Update orbit angle
                planet.angle += deltaTime * planet.currentSpeed * 0.05;

                // Update planet position
                planet.mesh.position.x = Math.cos(planet.angle) * planet.info.distance;
                planet.mesh.position.z = Math.sin(planet.angle) * planet.info.distance;

                // Rotate planet on its axis
                planet.mesh.rotation.y += deltaTime * 1.5;
            });

            // Slowly rotate stars
            if (this.stars) {
                this.stars.rotation.y += deltaTime * 0.005;
            }

            // Auto-rotate camera slightly for better view
            const time = this.clock.getElapsedTime();
            const radius = 200;
            this.camera.position.x = Math.cos(time * 0.02) * radius;
            this.camera.position.z = Math.sin(time * 0.02) * radius;
            this.camera.position.y = 80 + Math.sin(time * 0.01) * 20;
            this.camera.lookAt(0, 0, 0);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the solar system when the page loads
window.addEventListener('load', () => {
    new SolarSystem();
});