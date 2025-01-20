function encodeBase64(str) {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(str);
  return btoa(String.fromCharCode(...uint8Array));
}

const storage = {
  async auth() {
    let auth = await localStorage.getItem("auth");
    if (!auth) {
      window.open(
        "https://github.com/settings/tokens/new?scopes=repo&description=e4mi.github.io"
      );
      auth = prompt("Enter your GitHub token");
    }
    if (!auth) {
      return alert("Cannot authenticate");
    }
    localStorage.setItem("auth", auth);
    return auth;
  },
  
  async get(key) {
    const auth = await storage.auth();
    const response = await fetch(
      `https://api.github.com/repos/e4mi/e4mi.github.io/contents/${key}`,
      {
        headers: {
          Authorization: `token ${auth}`,
        },
      }
    );
    return await response.json();
  },

  async set(key, value) {
    const auth = await storage.auth();
    
    // Step 1: Fetch the existing file details to get the sha
    const fileInfo = await this.get(key);
    
    // Step 2: Get the current sha of the file
    const sha = fileInfo.sha;
    
    // Step 3: Send the updated file with the correct sha
    return await fetch(
      `https://api.github.com/repos/e4mi/e4mi.github.io/contents/${key}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "update",
          content: encodeBase64(value),  // Base64 encoded file content
          sha: sha,                      // Existing sha of the file to update
        }),
      }
    );
  },
};

export default storage;
