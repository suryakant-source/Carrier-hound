async function checkVisa() {
  const res = await fetch("https://api.smartrecruiters.com/v1/companies/visa/postings?limit=2").then(r => r.json());
  console.log("Visa keys:", Object.keys(res));
  console.log("Visa data:", res);
}
checkVisa();
