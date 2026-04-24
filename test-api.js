fetch('http://localhost:3000/api/doctors?city=jehanabad')
  .then(res => res.json())
  .then(data => {
    console.log("Success:", data.success);
    console.log("Total docs:", data.data ? data.data.length : 0);
  })
  .catch(console.error);
