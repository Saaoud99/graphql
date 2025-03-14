const DOMAIN_NAME = "zone01oujda.ma"
const AUTH_URL =`${DOMAIN_NAME}/api/auth/signin`
const GQL_URL = `${DOMAIN_NAME}/api/graphql-engine/v1/graphql`


async function Authorization(username,password) {
    try{
        let base = btoa(`${username}:${password}`)
        const response = await fetch(AUTH_URL, {
            method: 'POST',
            headers: {
                "Authorization": `Basic ${base}`,
            },
        })
        const data = await response.json()
        console.log(data)
        return data
    }catch(err){
        console.log(err)
        return err
    }
}

async function Getdata(token,query){
    try{
        const response = await fetch(GQL_URL, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${token}` },
            body: JSON.stringify({
                query: query
            })
        })
    
        const data = await response.json();
        return data;
    }catch(err){
        console.log(err)
        return err
    }
}

function IsAuthoris(){
    let token= localStorage.getItem('token')
    if (!token){
        return false
    }else{
        return true
    }
}
export{Authorization,Getdata,IsAuthoris}



