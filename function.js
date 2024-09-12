function toggleServiceContent(number) {
    /**
     * Function used for toggling the service content
     * */
    var content = document.getElementById("service-group-container");
    let element = document.getElementById("mainStyleSheet");
    let href = element.getAttribute("href");
    // Service contents
    let part_1_content = `        
    <div class="center-content">
      <div class="service-content-container kalam-light">
        <p>
          Service and community involvement have always been important aspects of my personal and professional development. Throughout my academic journey at <a class="base-ref" href="https://www.bellevuecollege.edu/">Bellevue College</a> and <a href="https://www.tamu.edu/index.html" class="base-ref">Texas A&M University</a>, I have sought opportunities to give back to my community by leveraging my skills in technology and leadership. One of the most impactful ways I have contributed is through my involvement in the Latinx Students of Bellevue College, where I served as Treasurer. In this role, I was responsible for managing the organization&rsquo;s finances, and I was deeply involved in organizing events and initiatives that aimed to empower Latinx students on campus. These events provided a platform for underrepresented students to connect, share their experiences, and gain access to resources that support their academic and personal growth.
        </p>
      </div>
    </div>
    `
    let part_2_content = `
    <div class="center-content">
      <div class="service-content-container kalam-light">
        <p>
          In addition to my work with the Latinx community, I have been actively participating in hackathons where I used my technical skills to create solutions that address real-world problems. For instance, my team and I developed a web application during <a href="https://devpost.com/software/jobs4ags-howdyhack-23" class="base-ref">HowdyHack 2023</a> that streamlined the job and internship search process for students. While this project was technically challenging, it was also rewarding because it had the potential to make a tangible difference in the lives of my peers. This experience inspired me to continue looking for opportunities where I could use my technical expertise to benefit others.
        </p>
      </div>
    </div>
    `
    let part_3_content = `
    <div class="center-content">
      <div class="service-content-container kalam-light">
        <p>
          In the future, I am eager to continue giving back to my community by mentoring younger students interested in technology. I understand the challenges of pursuing a career in computer science, especially for those from underrepresented backgrounds. I want to provide guidance and support to help them navigate their academic and professional journeys. Additionally, I am interested in volunteering to teach coding and digital literacy skills to underepresented populations. I believe technology can transform lives, and I am committed to using my skills to help bridge the digital divide and create opportunities for others. Through direct mentorship, community outreach, or developing technology-driven solutions to social issues, I am dedicated to giving back and making a positive impact on those around me.
        </p>
      </div>
    </div>
    `
    if (href === "style_2.css") {
      if (number === 0) {
        content.innerHTML = part_1_content;
      }
      else if (number === 1) {
        content.innerHTML = part_2_content;
      } else {
        content.innerHTML = part_3_content;
      }
      content.innerHTML += `
        <div class="service-content-buttons">
          <button onclick="toggleServiceContent(0)" class="service-content-button">1</button>
          <button onclick="toggleServiceContent(1)" class="service-content-button">2</button>
          <button onclick="toggleServiceContent(2)" class="service-content-button">3</button>
        </div>`
    } else{
      if (number === 0) {
        content.innerHTML = `
        <button disabled class="button-previous-disabled"></button>
        ${part_1_content}
        <button onclick="toggleServiceContent(1)" class="button-next"></button>`;
      }
      else if (number === 1) {
        content.innerHTML = `
        <button onclick="toggleServiceContent(0)" class="button-previous"></button>
        ${part_2_content}
        <button onclick="toggleServiceContent(2)" class="button-next"></button>`;
      } else {
        content.innerHTML = `
        <button onclick="toggleServiceContent(1)" class="button-previous"></button>
        ${part_3_content}
        <button disabled class="button-next-disabled"></button>
        `;
      }
    }
}

function toggleStyleSheet(){
  // Get style element by ID
  let element = document.getElementById("mainStyleSheet");

  // Check the current stylesheet file name
  let href = element.getAttribute("href");

  // Determine new stylesheet file name based on the current one
  let file_name = href === "style_1.css" ? "style_2.css" : "style_1.css";

  // Replace stylesheet with new stylesheet
  element.setAttribute("href", file_name);

  // For persistence when page is refreshed, save new stylesheet name to localStorage
  localStorage.setItem("stylesheet", file_name);
  toggleServiceContent(0);
}

function hideNavbar() {
  //Hide the navbar to a left position of -180px
  let element = document.getElementById("navbar-links");
  element.style.animation = 'moveToLeft 1s ease-in-out forwards';
  element.style.left = '-200px';
}

function openNavbar() {
    //Hide the navbar to a left position of -180px
    let element = document.getElementById("navbar-links");
    element.style.animation = 'moveToRight 1s ease-in-out forwards';
    element.style.left = '0';
}

window.onload = function(){
  // Get stylesheet name from local storage
  let savedStyleSheet = localStorage.getItem("stylesheet");

  // Get HTML style element by ID
  let element = document.getElementById("mainStyleSheet");

  // If a stylesheet was saved, replace href attribute of the element
  if (savedStyleSheet) {
    var slider_element = document.getElementById("toggle-switch");
    if(savedStyleSheet === "style_2.css"){
      slider_element.checked = true;  // Set checked to true
    } else {
      slider_element.checked = false; // Set checked to false if not style_2.css
    }
    element.setAttribute("href", savedStyleSheet);
  }else {
    element.setAttribute("href", "style_1.css");
  }
}
