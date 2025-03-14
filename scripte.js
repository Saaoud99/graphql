import {Authorization,Getdata,IsAuthoris } from "/utils/dataFetch.js";

let profileDate ={}

 let queries = {

    userInfo : `
        {
        user{
            login
            firstname
            lastname
            totalDown
            totalUp
            }
        }`,
    skills:`
    {
    transaction(
            where: { type: {_like: "skill%" } },
                    order_by: { amount: desc }
                ){
                    type
                    amount
            }
    }
    `,        
}


async function getProfileData(){
    try{
        let token = localStorage.getItem('token')
        let [userResponse,skills] = Promise.all(
            Getdata(token,queries.userInfo),
            Getdata(token,queries.skills)
        )
        let userData = await userResponse.json()
        let userSkills = await skills.json()
        profileDate={userData,userSkills}
    }catch(err){
        console.log(err)
        return err
    }
}

function DespalyProfile(){
    if (!IsAuthoris()){
       history.pushState('',"","/login")
       location.reload()

    }
    let app = document.getElementById('app')

    app.innerHTML=`
    <div>hello</div>
    `
}

if (location.pathname ==="/profile"){
    getProfileData()
    DespalyProfile()
}

if (location.pathname === '/login'){
    if (IsAuthoris()){
        history.pushState('','',"/profile")
        location.reload()

    }
}

window.onpopstate = ()=>{
    location.reload()
}