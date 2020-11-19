export default (file, token, progress) => {
  let url = `/api/storage/o/public/${file.name}`;
  let formData = new FormData();

  formData.append("file", file);

  let ajax = new XMLHttpRequest();
  ajax.upload.addEventListener("progress", progress, false);
  ajax.open("POST", url);
  ajax.setRequestHeader("Authorization", `Bearer ${token}`);
  ajax.send(formData);
};