async function fetchJobs() {
  try {
    const job = await fetch("../data.json");
    const data = await job.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
}

fetchJobs();
