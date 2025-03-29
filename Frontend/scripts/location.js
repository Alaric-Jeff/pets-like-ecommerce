// Initialize the map with a default view
const map = L.map("map").setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Function to fetch address using Reverse Geocoding
const getAddress = async (lat, lon) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        return data.display_name || "Address not found";
    } catch (error) {
        console.error("Error fetching address:", error);
        return "Error fetching address";
    }
};

// Get user's location
navigator.geolocation.getCurrentPosition(
    async (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13); // Center map on user

        // Fetch and display address
        const address = await getAddress(latitude, longitude);
        document.getElementById("address").innerText = `Your Address: ${address}`;

        // Add a marker
        L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`You are here! <br> ${address}`)
            .openPopup();
    },
    () => {
        console.log("Geolocation access denied or unavailable.");
        document.getElementById("address").innerText = "Geolocation denied.";
    }
);
