import {Authenticate,GetData,Authorized } from "/utils/dataFetch.js";

let profileDate ={}

 let queries = {

    userInfo : `{
    user{
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
    console.log("22222")
    try{
        let token = localStorage.getItem('token')
        let [userResponse,skills] = await Promise.all(
            [GetData(token,queries.userInfo),
            GetData(token,queries.skills)]
        )       
        profileDate={userResponse,skills}
        console.log(profileDate)
    }catch(err){
        console.log(err)
        return err
    }
}

async function DespalyProfile(){
    if (!Authorized()){
       history.pushState('',"","/login")
       location.reload()
       return
    }
    await getProfileData()
    console.log(profileDate)
    let app = document.getElementById('app')
    app.innerHTML=`
    <div><h2>THE PROFILE PAGE</h2></div>
        `
}

if (location.pathname === "/profile"){
    console.log("4444")
    DespalyProfile()
}

if (location.pathname === '/login'){
    if (Authorized()){
        history.pushState('','',"/profile")
        location.reload()

    }
    let loginn = document.querySelector('#submit')
    loginn.addEventListener('click', async()=>{
    try{
        let user = document.querySelector("#username").value
    let pass = document.querySelector("#password").value
    let jwt = await Authenticate(user, pass)
    localStorage.setItem("token", jwt)

    }catch(err){
        console.error(err)
    }
})
}

window.onpopstate = ()=>{
    location.reload()
}