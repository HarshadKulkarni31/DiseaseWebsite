document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const diseaseGrid = document.getElementById('diseaseGrid');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalCause = document.getElementById('modalCause');
    const modalPrevention = document.getElementById('modalPrevention');
    const modalTreatment = document.getElementById('modalTreatment');
    const closeButton = document.querySelector('.close-button');
    const loader = document.getElementById('loader');
    const shareButton = document.getElementById('shareButton');

    let diseases = [];
    let fuse;

    // ✅ Fetch disease data from local JSON file
    async function fetchDiseases() {
        loader.style.display = 'block';
        diseaseGrid.style.display = 'none';
        try {
            // 👇 Use correct local file name here
            const response = await fetch('disease.json');
            if (!response.ok) throw new Error('Failed to fetch disease data.');
            diseases = await response.json();

            // ✅ Initialize Fuse.js for fuzzy searching
            const options = {
                keys: ['name'],
                includeScore: true,
                threshold: 0.4
            };
            fuse = new Fuse(diseases, options);

            displayDiseases(diseases);
        } catch (error) {
            console.error('Error fetching disease data:', error);
            diseaseGrid.innerHTML = '<p style="text-align: center; color: #ff6b6b;">Failed to load disease data. Please try again later.</p>';
        } finally {
            loader.style.display = 'none';
            diseaseGrid.style.display = 'grid';
        }
    }

    // ✅ Render disease cards into the grid
    function displayDiseases(diseaseList) {
        diseaseGrid.innerHTML = '';
        diseaseList.forEach(disease => {
            const card = document.createElement('div');
            card.className = 'disease-card';
            card.dataset.name = disease.name;
            card.innerHTML = `<h3>${disease.name}</h3>`;
            card.addEventListener('click', () => openModal(disease));
            diseaseGrid.appendChild(card);
        });
    }

    // ✅ Open modal and populate it with disease info
    function openModal(disease) {
        modalTitle.textContent = disease.name;
        modalCause.textContent = disease.cause;
        modalPrevention.textContent = disease.prevention;
        modalTreatment.textContent = disease.treatment;
        modal.style.display = 'block';
    }

    // ✅ Close modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // ✅ Search input handler
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query) {
            const results = fuse.search(query).map(result => result.item);
            displayDiseases(results);
        } else {
            displayDiseases(diseases);
        }
    });

    // ✅ Modal close handlers
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // ✅ Share button placeholder
    shareButton.addEventListener('click', () => {
        alert("This is an interactive preview of your website.\n\nTo share it, you'll need to deploy your project online (e.g., GitHub Pages, Netlify).");
    });

    // ✅ Initial fetch
    fetchDiseases();
});
