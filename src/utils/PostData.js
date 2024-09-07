export function PostData(type, userData, authentication = null) {

    let BaseURL = 'https://localhost/social-media-manager/api/';

    return new Promise((resolve, reject) => {
        fetch(BaseURL + type, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authentication
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                resolve(responseJson);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function UploadFilesAndData(type, userData, thumbnailFile, mainFiles, authentication) {
    let BaseURL = 'https://localhost/social-media-manager/api/';

    // Create a new FormData object
    let formData = new FormData();

    // Append the JSON data to FormData
    formData.append('data', JSON.stringify(userData));

    // Append the thumbnail file to FormData
    if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
    }

    // Append main files to FormData
    mainFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file);
    });

    return new Promise((resolve, reject) => {
        fetch(BaseURL + type, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': authentication // Authorization if needed
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                resolve(responseJson);
            })
            .catch((error) => {
                reject(error);
            });
    });
}