/* ========================================== */
/* FRENCH VERSION (Wallonie/Bruxelles)        */
/* Folder: /fr/                               */
/* File: script.js                            */
/* ========================================== */

const app = {
    currentStep: 0,
    data: {
        spec: null,
        size: null,
        intl: null,
        pricing: null
    },
    
    // Configuration des menaces basée sur les signaux publics du marché belge
    threatMatrix: {
        'tax_litigation': { big4_pressure: 0.3, moore_pressure: 0.2, density: 'medium' },
        'corporate_ma': { big4_pressure: 0.9, moore_pressure: 0.8, density: 'high' },
        'esg_advisory': { big4_pressure: 0.8, moore_pressure: 0.4, density: 'high' },
        'audit_assurance': { big4_pressure: 0.95, moore_pressure: 0.9, density: 'very_high' }
    },

    sizeMultiplier: {
        'small': 0.7,
        'medium': 1.0,
        'large': 1.3
    },

    init() {
        this.showSection('intro-section');
    },

    showSection(id) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        window.scrollTo(0, 0);
    },

    nextStep() {
        this.currentStep++;
        this.showSection(`step-${this.currentStep}`);
    },

    selectOption(category, value, element) {
        // Désélectionner les autres
        const parent = element.parentElement;
        parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        element.classList.add('selected');
        
        this.data[category] = value;
        
        // Délai pour l'UX puis passage à l'étape suivante
        setTimeout(() => {
            if (this.currentStep < 4) {
                this.nextStep();
            } else {
                this.calculateResults();
            }
        }, 400);
    },

    calculateResults() {
        // Logique de modélisation stratégique
        const specData = this.threatMatrix[this.data.spec];
        const sizeMult = this.sizeMultiplier[this.data.size];
        
        // Calcul de la menace Big 4 (modélisation)
        let threatScore = (specData.big4_pressure * 0.6 + specData.moore_pressure * 0.4) * sizeMult;
        
        // Ajustement exposition internationale
        if (this.data.intl === 'global') threatScore *= 1.2;
        if (this.data.intl === 'local') threatScore *= 0.8;
        
        // Calcul de l'indice d'asymétrie (opportunité)
        // Plus la menace est forte dans une spécialisation "chaude", plus l'asymétrie est possible via la niche
        let asymmetryScore = 0;
        if (this.data.pricing === 'premium' && this.data.size === 'small') {
            asymmetryScore = 85; // Niche premium défendable
        } else if (this.data.spec === 'esg_advisory' && this.data.size !== 'large') {
            asymmetryScore = 75; // ESG encore fragmenté
        } else if (threatScore > 0.8) {
            asymmetryScore = 40; // Marché saturé, asymétrie faible
        } else {
            asymmetryScore = 60;
        }

        // Détermination du niveau de menace
        let threatLevel, threatText, threatColor;
        if (threatScore > 0.9) {
            threatLevel = 'Menace Structurelle';
            threatText = 'Vulnérabilité élevée aux appels d\'offres Big 4.';
        } else if (threatScore > 0.6) {
            threatLevel = 'Pression Élevée';
            threatText = 'Concurrence active sur les grands comptes.';
        } else if (threatScore > 0.4) {
            threatLevel = 'Pression Modérée';
            threatText = 'Zone de confort relative mais surveillance nécessaire.';
        } else {
            threatLevel = 'Pression Faible';
            threatText = 'Position de défense solide dans la niche.';
        }

        // Génération du consortium
        const consortium = this.generateConsortium();

        // Affichage des résultats
        document.getElementById('threat-level').textContent = threatLevel;
        document.getElementById('threat-level').style.color = threatScore > 0.8 ? '#ef4444' : (threatScore > 0.5 ? '#f59e0b' : '#10b981');
        document.getElementById('threat-context').textContent = threatText;
        document.getElementById('asymmetry-index').textContent = asymmetryScore + '/100';
        document.getElementById('crowding-index').textContent = this.getDensityLabel(specData.density);
        
        document.getElementById('strategic-narrative').innerHTML = this.generateNarrative(threatScore, asymmetryScore);
        
        this.renderHeatmap();
        this.renderConsortium(consortium);
        
        this.showSection('results-section');
    },

    getDensityLabel(density) {
        const labels = {
            'very_high': 'Très Élevée (Saturé)',
            'high': 'Élevée',
            'medium': 'Modérée',
            'low': 'Faible (Opportunité)'
        };
        return labels[density] || 'Modérée';
    },

    generateNarrative(threat, asymmetry) {
        let narrative = '';
        
        if (threat > 0.8) {
            narrative = `<strong>Analyse :</strong> Votre positionnement actuel est directement dans la ligne de mire des stratégies d'encerclement des grands réseaux. `;
            narrative += `La densité des recrutements publics dans votre spécialisation indique une volonté d'absorption du marché mid-market. `;
        } else if (threat > 0.5) {
            narrative = `<strong>Analyse :</strong> Vous opérez dans une zone de concurrence active mais structurée. `;
        } else {
            narrative = `<strong>Analyse :</strong> Votre positionnement de niche offre une défense naturelle contre la standardisation Big 4. `;
        }

        if (asymmetry > 70) {
            narrative += `<br><br><strong>Recommandation Stratégique :</strong> Votre indice d'asymétrie élevé suggère une opportunité de "contournement". Au lieu de concourir frontalement sur les appels d'offres généralistes, concentrez vos efforts sur la création d'un consortium d'excellence (voir simulation ci-dessous) pour proposer une alternative crédible aux réseaux internationaux.`;
        } else {
            narrative += `<br><br><strong>Recommandation Stratégique :</strong> La différenciation par la spécialisation technique ultra-pointue reste votre meilleure défense. Évitez la guerre des tarifs sur les segments généralistes.`;
        }
        
        return narrative;
    },

    generateConsortium() {
        // Logique de matching complémentaire basée sur la spécialisation actuelle
        const archetypes = [
            { name: 'Cabinet Technique Niche', role: 'Expertise sectorielle pointue (ex: Pharma, Fintech)' },
            { name: 'Conseil ESG Indépendant', role: 'Reporting CSRD & Due Diligence' },
            { name: 'Tax Litigation Boutique', role: 'Contentieux fiscal complexe transfrontalier' },
            { name: 'IT Advisory Specialist', role: 'Cybersécurité & Conformité données' },
            { name: 'Corporate Finance Indépendant', role: 'M&A mid-market et levée de fonds' }
        ];

        // Sélectionner 3 complémentaires selon la spécialisation actuelle
        let selected = [];
        if (this.data.spec === 'tax_litigation') {
            selected = [archetypes[1], archetypes[3], archetypes[4]];
        } else if (this.data.spec === 'corporate_ma') {
            selected = [archetypes[0], archetypes[2], archetypes[3]];
        } else if (this.data.spec === 'esg_advisory') {
            selected = [archetypes[0], archetypes[2], archetypes[4]];
        } else {
            selected = [archetypes[0], archetypes[1], archetypes[4]];
        }
        
        return selected;
    },

    renderHeatmap() {
        const container = document.getElementById('service-heatmap');
        const services = [
            { name: 'Audit', intensity: 0.9 },
            { name: 'Tax', intensity: 0.7 },
            { name: 'Conseil', intensity: 0.8 },
            { name: 'ESG', intensity: 0.6 },
            { name: 'Risk', intensity: 0.75 },
            { name: 'Data', intensity: 0.85 },
            { name: 'Legal', intensity: 0.5 },
            { name: 'MA', intensity: 0.9 }
        ];
        
        container.innerHTML = services.map(s => {
            const color = s.intensity > 0.8 ? '#000887' : (s.intensity > 0.6 ? '#4a5fd9' : '#a5b0e8');
            return `<div class="heatmap-cell" style="background: ${color}">${s.name}</div>`;
        }).join('');
    },

    renderConsortium(archetypes) {
        const container = document.getElementById('consortium-archetypes');
        container.innerHTML = archetypes.map(a => `
            <div class="archetype-card">
                <h4>${a.name}</h4>
                <p>${a.role}</p>
            </div>
        `).join('');
    },

    reset() {
        this.currentStep = 0;
        this.data = { spec: null, size: null, intl: null, pricing: null };
        document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        this.showSection('intro-section');
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
