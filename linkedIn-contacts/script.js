const state = {
  contacts: [],
  pendingInvitations: [],
};

loadNewContacts(8);
displayPendingInvitationsCount();

/**************************************************************************************/

function loadNewContacts(count) {
  fetch(`https://dummy-apis.netlify.app/api/contact-suggestions?count=${count}`)
    .then((response) => {
      if (!response.ok) {
        console.error("failed to Load Data");
      }
      return response.json();
    })
    .then((jsonData) => {
      state.contacts = [...state.contacts, ...jsonData];

      render();
    });
}

function removeFromContactSuggestions() {
  const parentWrapperElement = this.parentElement;
  const contactIndex = parentWrapperElement.dataset.id;

  parentWrapperElement.remove();
  state.contacts.splice(contactIndex, 1);
  loadNewContacts(1);
}

function toggleUserInvitation() {
  const parentWrapperElement = this.parentElement;
  const contactIndex = parentWrapperElement.dataset.id;
  const contact = state.contacts[contactIndex];

  if (!state.pendingInvitations.includes(contact)) {
    state.pendingInvitations.push(contact);
  } else {
    state.pendingInvitations.splice(
      state.pendingInvitations.findIndex((e) => e === contact),
      1
    );
  }

  displayPendingInvitationsCount();
  render();
}

function displayPendingInvitationsCount() {
  const pendingInvitationsInfo = document.querySelector(
    ".pending-invitations-count"
  );
  if (state.pendingInvitations.length > 0) {
    pendingInvitationsInfo.innerText =
      state.pendingInvitations.length + " pending invitations";
  } else {
    pendingInvitationsInfo.innerText = "No pending invitations";
  }
}

function contactTemplate(contactData, contactIndex) {
  /** wrapper */
  const wrapperElement = document.createElement("div");
  wrapperElement.setAttribute("data-id", contactIndex);
  wrapperElement.classList.add("contact-element");

  const imageWrapper = document.createElement("div");
  imageWrapper.classList.add("image-wrapper");

  const backgroundImageUrl =
    "url(" +
    contactData.backgroundImage +
    "?random=" +
    contactData.name.first +
    ")";

  imageWrapper.style.setProperty(
    "--profile-background-image",
    backgroundImageUrl
  );

  /** remove button */
  const removeContactSuggestionButton = document.createElement("button");
  removeContactSuggestionButton.innerText = "✕";
  removeContactSuggestionButton.classList.add("close-btn");

  removeContactSuggestionButton.addEventListener(
    "click",
    removeFromContactSuggestions
  );

  /** contact Image */
  const userImage = document.createElement("img");
  userImage.src = contactData.picture;
  userImage.classList.add("profile-pic");

  /** contact name */
  const userName = document.createElement("h2");
  const userNameTxt = document.createTextNode(
    contactData.name.first + " " + contactData.name.last
  );
  userName.appendChild(userNameTxt);
  userName.classList.add("user-name");

  /** profession */
  const pProfession = document.createElement("p");
  const professionTxt = document.createTextNode(contactData.title);
  pProfession.appendChild(professionTxt);
  pProfession.classList.add("profession");

  /** Additional Information */
  const pMore = document.createElement("p");

  const pMoreTxt = document.createTextNode(
    "ↀ " + contactData.mutualConnections + " mutual connections"
  );

  pMore.appendChild(pMoreTxt);
  pMore.classList.add("mutual-conntections-info");

  /** connect button */
  const connectButton = document.createElement("button");
  connectButton.classList.add("connect-btn");
  connectButton.addEventListener("click", toggleUserInvitation);

  if (state.pendingInvitations.includes(contactData)) {
    connectButton.innerText = "Pending";
  } else {
    connectButton.innerText = "Connect";
  }

  imageWrapper.appendChild(userImage);
  wrapperElement.append(
    imageWrapper,
    removeContactSuggestionButton,
    userName,
    pProfession,
    pMore,
    connectButton
  );

  return wrapperElement;
}

function render() {
  const contactsContainer = document.querySelector(".contacts-section");
  contactsContainer.innerHTML = "";
  for (let i = 0; i < state.contacts.length; i++) {
    const personElement = contactTemplate(state.contacts[i], i);
    contactsContainer.append(personElement);
  }
}
