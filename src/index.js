document.addEventListener("DOMContentLoaded", () => {
  createDogsInfo();
  const filterButton = document.getElementById("good-dog-filter");
  filterButton.addEventListener("click", (e) => {
    if (e.target.textContent.includes("OFF")) {
      e.target.textContent = "Filter good dogs: ON";
      return getDogs().then((res) => {
        const filteredGoodDogs = res.filter((dog) => dog.isGoodDog);
        createDogBarSpans(filteredGoodDogs);
      });
    }
    return getDogs().then((res) => {
      e.target.textContent = "Filter good dogs: OFF";
      createDogBarSpans(res);
    });
  });
});

function getDogs() {
  return fetch("http://localhost:3000/pups")
    .then((res) => res.json())
    .then((data) => data);
}

function createDogsInfo() {
  getDogs().then((data) => createDogBarSpans(data));
}

function createDogBarSpans(data) {
    const div = document.getElementById("dog-bar");
    div.textContent = ""
  data.forEach((element) => {
    const span = document.createElement("span");
    span.textContent = element.name;
    span.setAttribute("id", element.id);
    span.addEventListener("click", (e) => {
      const id = parseInt(e.target.id);
      getDogInfo(id);
    });
    div.appendChild(span);
  });
}

function getDogInfo(id) {
  fetch(`http://localhost:3000/pups/${id}`, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      const div = document.getElementById("dog-info");
      div.textContent = "";
      const image = document.createElement("img");
      image.setAttribute("src", data.image);
      const h2 = document.createElement("h2");
      h2.textContent = data.name;
      const button = document.createElement("button");
      button.textContent = data.isGoodDog === true ? "Good Dog!" : "Bad Dog!";
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const value = !data.isGoodDog;
        setIsGoodDog(id, value).then((data) => {
          e.target.textContent =
            data.isGoodDog === true ? "Good Dog!" : "Bad Dog!";
        });
      });
      div.appendChild(image);
      div.appendChild(h2);
      div.appendChild(button);
    });
}

function setIsGoodDog(id, value) {
  return fetch(`http://localhost:3000/pups/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      isGoodDog: value,
    }),
  }).then((res) => res.json());
}
