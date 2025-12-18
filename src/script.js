async function fetchJobs() {
  try {
    const job = await fetch("../data.json");
    const data = await job.json();
    return data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
}

fetchJobs()
  .then((jobs) => {
    const jobList = document.getElementById("job-list");
    jobList.innerHTML = ""; // Clear existing content
    jobs.forEach((job) => {
      const jobCard = document.createElement("section");
      jobCard.className =
        jobCard.className = `jobs flex flex-col md:flex-row mx-auto w-[330px]
                            md:justify-between mt-10 items-center md:w-2/3 md:p-6
                            bg-white shadow-[#5da5a4] shadow-md rounded-md
                            ${
                              job.featured ? "border-l-6 border-[#5da5a4]" : ""
                            }`;
      jobCard.dataset.role = job.role.toLowerCase();
      jobCard.dataset.level = job.level.toLowerCase();
      jobCard.dataset.language = job.languages
        .map((l) => l.toLowerCase())
        .join(" ");
      jobCard.dataset.tools = job.tools.map((t) => t.toLowerCase()).join(" ");

      jobCard.innerHTML = `
            <div class="flex flex-col md:flex-row space-x-7">
                <img src="${job.logo}" alt="${
        job.company
      } logo" class="h-16 w-16 md:h-24 md:w-24 -mt-10 md:mt-0"/>
                <div class="flex flex-col space-y-2 md:justify-center mt-4 md:mt-0">
                    <div class="flex justify-start items-center space-x-4">
                        <h2 class="text-[#5da5a4] font-bold text-lg">${
                          job.company
                        }</h2>
                        ${
                          job.new
                            ? '<span class="bg-[#5da5a4] text-white uppercase font-medium rounded-full text-sm p-1">New!</span>'
                            : ""
                        }
                        ${
                          job.featured
                            ? '<span class="bg-black text-white uppercase font-medium rounded-full text-sm p-1">Featured</span>'
                            : ""
                        }
                    </div>
                    <h1 class="font-bold hover:text-[#5da5a4] text-sm md:text-xl  cursor-pointer">${
                      job.position
                    }</h1>
                    <div class="flex space-x-4 mt-2 text-gray-400 font-medium">
                        <span>${job.postedAt}</span>
                        <span>•</span>
                        <span>${job.contract}</span>
                        <span>•</span>
                        <span>${job.location}</span>
                    </div>
                </div>
            </div>
            <hr class="my-4 border border-gray-300 w-full md:hidden"/>
            <div class="flex flex-wrap m-5 md:flex-nowrap space-x-4">
                <button data-filter="${
                  job.role
                }" class="filter-btn bg-gray-100 hover:cursor-pointer hover:bg-[#5da5a4] hover:text-white p-2 font-semibold text-[#5da5a4]">
                    ${job.role}
                </button>
                <button data-filter="${
                  job.level
                }" class="filter-btn bg-gray-100 hover:cursor-pointer hover:bg-[#5da5a4] hover:text-white p-2 font-semibold text-[#5da5a4]">
                    ${job.level}
                </button>
                ${job.languages
                  .map(
                    (lang) =>
                      `<button data-filter="${lang}" class="filter-btn bg-gray-100 hover:cursor-pointer hover:bg-[#5da5a4] hover:text-white p-2 font-semibold text-[#5da5a4]">${lang}</button>`
                  )
                  .join("")}
                
            </div>
        `;
      jobList.appendChild(jobCard);
    });
    //active filter items container
    const activeFilter = document.getElementById("active-filter");
    // toggle filter box visibility
    const filterBox = document.getElementById("filter-box");
    //get all filter buttons
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterBox.style.display = "none"; //hide filter box initially
    filterButtons.forEach((button) => {
      button.onclick = () => {
        filterBox.style.display = "flex";
        const filterValue = button.getAttribute("data-filter");
        //check if filter already exists
        const existingFilter = document.querySelector(
          `#active-filter button[data-filter="${filterValue}"]`
        );
        if (!existingFilter) {
          const filterItem = document.createElement("button");
          filterItem.className =
            "bg-gray-200 flex justify-center items-center gap-10";
          filterItem.setAttribute("data-filter", filterValue);
          filterItem.innerHTML = `
                    <span class="text-[#5da5a4] font-semibold ml-2">${filterValue}</span>
                    <button class="bg-[#5da5a4] hover:bg-[#234241] text-white font-bold p-1 w-10 hover:cursor-pointer">X</button>
                `;
          //add remove functionality
          filterItem.querySelector("button").onclick = () => {
            filterItem.remove();
            //if no filters left, hide filter box
            if (activeFilter.children.length === 0) {
              filterBox.style.display = "none";
            }
            applyFilters();
          };
          activeFilter.appendChild(filterItem);
          applyFilters();
        }
      };
    });
    document.getElementById("clear-btn").onclick = () => {
      activeFilter.innerHTML = "";

      applyFilters();
    };
    function applyFilters() {
      const activeFilters = Array.from(
        activeFilter.querySelectorAll("button[data-filter]")
      ).map((btn) => btn.dataset.filter.toLowerCase());

      const jobCards = document.querySelectorAll("#job-list section");

      jobCards.forEach((card) => {
        const cardFilters = [
          card.dataset.role,
          card.dataset.level,
          ...card.dataset.language.split(" "),
          ...card.dataset.tools.split(" "),
        ];

        const isVisible = activeFilters.every((filter) =>
          cardFilters.includes(filter)
        );

        card.style.display = isVisible ? "flex" : "none";
      });
    }
  })
  .catch((error) => {
    console.error("Error processing jobs:", error);
  });
