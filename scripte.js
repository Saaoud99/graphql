import { Authenticate, GetData, Authorized } from "/utils/dataFetch.js";

let profileData = {};

const queries = {
    userInfo: `
        {
            user {
                login
                firstName
                lastName
                attrs
                auditRatio
                campus
                createdAt
                totalDown
                totalUp
                updatedAt
            }
        }
    `,
    skills: `
        {
            transaction(
                where: { type: { _like: "skill%" } },
                distinct_on: type
            ) {
                type
                amount
            }
        }
    `,
};

async function getProfileData() {
    try {
        const token = localStorage.getItem('token');
        const [userResponse, skillsResponse] = await Promise.all([
            GetData(token, queries.userInfo),
            GetData(token, queries.skills),
        ]);

        // Extracting actual data from the response
        profileData = {
            userResponse: userResponse.data.user,
            skills: skillsResponse.data.transaction,
        };
        
        return profileData;
    } catch (err) {
        console.error("Error fetching profile data:", err);
        return null;
    }
}

async function DespalyProfile() {
    if (!Authorized()) {
        history.pushState('', '', "/login");
        location.reload();
        return;
    }

    const data = await getProfileData();

    if (!data) {
        localStorage.removeItem("token"); 
        document.getElementById('erro').innerHTML = `<p>401 Unauthorized</p>`;
       
        
       // window.location.href = "/login";
        return;
    }

    const { userResponse, skills } = profileData;
    console.log(userResponse)
    let skillsHTML = skills.map(skill => `
        <div>
            <strong>${skill.type}</strong>: ${skill.amount}%
        </div>`).join('');

    let app = document.getElementById('app');
    app.innerHTML = `
        <div>
            <h2>THE PROFILE PAGE</h2>
            <h4>Login: ${userResponse[0].login}</h4>
            <h4>Name: ${userResponse[0].firstName} ${userResponse[0].lastName}</h4>
            <h4>Audit Ratio: ${userResponse[0].auditRatio.toFixed(1)}</h4>
            
            <div id="graphs" >
                <h3>Skills</h3>
                
            </div>
            <div id="ratio" >
                
                
            </div>

        </div>
    `;
    createSkillsGraphElement(profileData.skills)
    createTotale(profileData)

}

if (location.pathname === "/profile") {
    if (Authorized()) {
         history.pushState('', '', "/profile");
        console.log(true);
        
        DespalyProfile();
    }else{
        window.location.href = "/login"; 
    }
}

if (location.pathname === '/login') {
    if (Authorized()) {
        // history.pushState('', '', "/profile");
        // location.reload();
        console.log(true);
        
        
    }

    const loginButton = document.querySelector('#submit');
    loginButton.addEventListener('click', async () => {
        try {
            const user = document.querySelector("#username").value;
            const pass = document.querySelector("#password").value;
            const jwt = await Authenticate(user, pass);
            
            localStorage.setItem("token", jwt);
            window.location.href = "/profile"
        } catch (err) {
            console.error("Login error:", err);
        }
    });
}

window.onpopstate = () => {
    location.reload();
};


function createSkillsGraphElement(skillTransactions) {
    const graphs = document.getElementById("graphs")
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 860);
    svg.setAttribute("height", 450);
    svg.setAttribute("viewBox", "0 0 850 450");
    graphs.appendChild(svg);

    skillTransactions.forEach((t, index) => {
        const x = index * 40 + 45;
        const barHeight = (t.amount / 100) * 300;
        const y = 400 - barHeight - 50;

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", 30);
        rect.setAttribute("height", barHeight);
        rect.setAttribute("fill", "green");
        svg.appendChild(rect);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x + 7);
        text.setAttribute("y", 360);
        text.setAttribute("transform", `rotate(45, ${x + 7}, ${360})`);
        text.textContent = t.type.split('_')[1];
        svg.appendChild(text);

        const amountText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        amountText.setAttribute("x", x + 3);
        amountText.setAttribute("y", y - 5);
        amountText.textContent = `${t.amount}%`;
        svg.appendChild(amountText);
    });

    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", 45);
    xAxis.setAttribute("y1", 350);
    xAxis.setAttribute("x2", 680);
    xAxis.setAttribute("y2", 350);
    xAxis.setAttribute("stroke", "black");
    xAxis.setAttribute("stroke-width", "2");
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", 45);
    yAxis.setAttribute("y1", 50);
    yAxis.setAttribute("x2", 45);
    yAxis.setAttribute("y2", 350);
    yAxis.setAttribute("stroke", "black");
    yAxis.setAttribute("stroke-width", "2");
    svg.appendChild(yAxis);



    for (let i = 0; i <= 100; i += 10) {
        const yPosition = 350 - (i / 100) * 300;

        const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        yLabel.setAttribute("x", 35);
        yLabel.setAttribute("y", yPosition + 5);
        yLabel.setAttribute("text-anchor", "end");
        yLabel.setAttribute("font-size", "14");
        yLabel.textContent = `${i}%`;
        svg.appendChild(yLabel);

    }

}

function createTotale(profileData){
    const ratio = document.getElementById('ratio')
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 400);
    svg.setAttribute("height", 100);
    svg.setAttribute("viewBox", "0 0 400 100");
    ratio.appendChild(svg);
    const Up = profileData.userResponse[0].totalUp
    const Down = profileData.userResponse[0].totalDown
    const total = Up + Down

    const widthUp = Up / total * 300
    const widthDown = Down / total * 300

    const rectUp = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rectUp.setAttribute("x", 50);
    rectUp.setAttribute("y", 10);
    rectUp.setAttribute("width", widthUp);
    rectUp.setAttribute("height", 40);
    rectUp.setAttribute("fill", "green");
    svg.appendChild(rectUp);

    const amountText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        amountText.setAttribute("x", widthUp/2);
        amountText.setAttribute("y", 30);
        amountText.textContent = `Toale Up ${(Up/1000000).toFixed(2)}MB`;
        svg.appendChild(amountText);

    const rectDown = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rectDown.setAttribute("x", 50);
    rectDown.setAttribute("y", 60);
    rectDown.setAttribute("width", widthDown);
    rectDown.setAttribute("height", 40);
    rectDown.setAttribute("fill", "red");
    svg.appendChild(rectDown);
    const TextDown = document.createElementNS("http://www.w3.org/2000/svg", "text");
    TextDown.setAttribute("x", widthUp/2);
    TextDown.setAttribute("y", 80);
    TextDown.textContent = `Toale Down ${(Down/1000000).toFixed(2)}MB`;
    svg.appendChild(TextDown);

}

let logout = document.getElementById('logout');

logout.addEventListener('click', () => {
    localStorage.removeItem("token"); 
    window.location.href = "/login"; 
});
