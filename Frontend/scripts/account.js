document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "../pages/login.html";
      return;
    }
    document.getElementById("logoutbtn").addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "../index.html";
    });
    fetchProfile(token);
    const uploadBtn = document.getElementById("uploadProfileBtn");
    const profileModal = document.getElementById("profileModal");
    const closeModal = document.getElementById("closeProfileModal");
    const fileInput = document.getElementById("modalProfilePicInput");
    uploadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      profileModal.style.display = "flex";
    });
    closeModal.addEventListener("click", () => {
      profileModal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
      if (e.target === profileModal) {
        profileModal.style.display = "none";
      }
    });
    document.getElementById("uploadProfilePicBtn").addEventListener("click", async () => {
      const file = fileInput.files[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch("http://localhost:3000/upload-profile-image", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData
        });
        const data = await res.json();
        if (res.ok) {
          document.getElementById("profileImage").src = "http://localhost:3000" + data.image;
          profileModal.style.display = "none";
        }
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
    });
  });
  async function fetchProfile(token) {
    try {
      const res = await fetch("http://localhost:3000/get-profile", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      console.log("Fetched profile data:", data);
      const user = data.user;
      document.getElementById("firstname").value = user.firstname || "";
      document.getElementById("surname").value = user.surname || "";
      document.getElementById("email").value = user.email || "";
      document.getElementById("password").value = "********";
      document.getElementById("username").textContent = (user.firstname || "") + " " + (user.surname || "");
      if (user.ProfileImage && user.ProfileImage.image) {
        document.getElementById("profileImage").src = "http://localhost:3000" + user.ProfileImage.image;
        console.log("Profile image set to:", "http://localhost:3000" + user.ProfileImage.image);
      } else {
        console.log("No profile image available. Returned user object:", user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }
  
  