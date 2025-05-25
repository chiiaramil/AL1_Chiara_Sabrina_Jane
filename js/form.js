const genderField = document.getElementById('gender');
const firstnameField = document.getElementById('first_name');
const lastnameField = document.getElementById('last_name');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const submitButton = document.getElementById('submit_button');
const spinner = document.getElementById('form_spinner');
const btnText = submitButton.querySelector('.btn_text');
const formFields = document.getElementById('form_fields');
const successMessage = document.getElementById("success_message");
// Fehlercontainer
const firstNameError = document.getElementById('first_name_error');
const lastNameError = document.getElementById('last_name_error');
const emailError = document.getElementById('email_error');
const passwordError = document.getElementById('password_error');

function validateForm() {
  let isFormValid = true;

  // Vorname-Validierung
  if (firstnameField.value.trim().length <= 1) {
    firstNameError.textContent = "Verwende mindestens 2 Buchstaben.";
    isFormValid = false;
  } else {
    firstNameError.textContent = "";
  }

  // Nachname-Validierung
  if (lastnameField.value.trim().length <= 1) {
    lastNameError.textContent = "Verwende mindestens 2 Buchstaben.";
    isFormValid = false;
  } else {
    lastNameError.textContent = "";
  }

  // Email-Validierung
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailField.value)) {
    emailError.textContent = 'E-Mail muss gültig sein (z. B. name@domain.com)';
    isFormValid = false;
  } else {
    emailError.textContent = "";
  }

  // Passwort-Validierung
  const password = passwordField.value;
  const passwordErrors = [];
  if (!/[A-Z]/.test(password)) passwordErrors.push("mind. 1 Grossbuchstabe");
  if (!/[0-9]/.test(password)) passwordErrors.push("mind. 1 Zahl");
  if (!/[^A-Za-z0-9]/.test(password)) passwordErrors.push("mind. 1 Sonderzeichen");
  if (passwordField.value.trim().length <= 7) passwordErrors.push("eine Länge von mind. 8 Charakteren");

  if (passwordErrors.length > 0) {
    passwordError.textContent = "Passwort benötigt: " + passwordErrors.join(", ");
    isFormValid = false;
  } else {
    passwordError.textContent = "";
  }

  // Button (disabled or not) Validierung
  if (isFormValid) {
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "#1c4316";
  } else {
    submitButton.disabled = true;
    submitButton.style.backgroundColor = "grey";
  }
}

// Eventlistener für Eingabe
[firstnameField, lastnameField, emailField, passwordField].forEach(field =>
  field.addEventListener('input', validateForm)
);



submitButton.addEventListener("click", async (event) => {
  event.preventDefault();
  btnText.style.display = "none";
  spinner.style.display = "inline-block";

  try {
    // E-Mail prüfen, ob sie bereits einmal in der Datenbank gespeichert wurde
    const email = emailField.value;
    const checkEmailQuery = `SELECT * FROM formular WHERE email = '${email}'`;
    const existing = await databaseClient.executeSqlQuery(checkEmailQuery);

    if (existing && existing[1] && existing[1].length > 0) {
      // E-Mail existiert bereits
      spinner.style.display = "none";
      btnText.style.display = "inline";
      emailField.value = '';
      alert("Diese E-Mail wird bereits verwendet. Bitte wähle eine andere.");
      return; // Vorgang wird abgebrochen
    }

    // In Datenbank speichern, wenn E-Mail ungebraucht ist
    await databaseClient.insertInto("formular", {
      anrede: genderField.value,
      vorname: firstnameField.value,
      nachname: lastnameField.value,
      email: email,
      passwort: passwordField.value,
    });

    // Felder ausblenden
    formFields.classList.add("fade-out");
    setTimeout(() => {
      formFields.style.display = "none";
    }, 400);

    // Button stylen und Bestätigungsnachricht wiedergeben
    submitButton.classList.add("centered");
    submitButton.style.cursor = "default";
    submitButton.style.marginTop = "0vh";
    submitButton.disabled = true;
    btnText.innerHTML = "Konto erstellt!";
    btnText.style.display = "inline";
    spinner.style.display = "none";
    successMessage.innerHTML = `Danke für das Anlegen eines Benutzerkontos.<br />
    Da unser Shop noch nicht live ist, können wir dir deine Treuepunkte noch nicht gutschreiben.<br />
    Wir danken dir jedoch trotzdem. <br />
    <strong>Feature coming soon!</strong>`;

    setTimeout(() => {
      alert("Dein Konto bei BioTiful wurde erstellt.");
    }, 10);

  } catch (error) {
    spinner.style.display = "none";
    btnText.style.display = "inline";

    setTimeout(() => {
      alert("Es gab ein Problem beim Erstellen deines Kontos. Bitte versuche es erneut.");
    }, 10);

    console.error(error);
  }
});
