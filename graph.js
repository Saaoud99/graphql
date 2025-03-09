const Url = "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql";
const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5OCIsImlhdCI6MTc0MTUyOTEwOCwiaXAiOiIxOTYuMjAwLjE1OS4xMTQsIDE3Mi4xOC4wLjIiLCJleHAiOjE3NDE2MTU1MDgsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIl0sIngtaGFzdXJhLWNhbXB1c2VzIjoie30iLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwieC1oYXN1cmEtdXNlci1pZCI6Ijk4IiwieC1oYXN1cmEtdG9rZW4taWQiOiIxMWM3OGE4NC00OTNlLTRjMTMtYTJjZi1lNWIxYzI0MzdiOTQifX0.gXKGteOCo5JT5YUtLw_OZJQUk3ytvOPTAZI_5u-eLEI";

async function login(username, password) {
    let base = btoa(`${username}:${password}`)
    const response = await fetch(Url, {
        method: 'POST',
        headers: {
            "Authorization": `Basic ${base}`,
        },
    })
    const data = await response.json()
    console.log(data);


}
let query = {

    query1: `
                    {
                    user{
                        firstName
                        lastName
                    
                    }

                    
                    }

            `,
    
    query2:`
                {
                    
                    transaction(
                                        where: { type: {_like: "skill%" } },
                                        order_by: { amount: desc }
                                    ) {
                                        type
                                        amount
                                    }
                    
                    }
            `,
        
            query3:`
                {
                user{
                
                    totalDown
                    totalUp
                }
                
                }
            `
}
async function getdata(query) {
    const response = await fetch(Url, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${jwt}` },
        body: JSON.stringify({
            query: query
        })
    })

    const data = await response.json();
    return data;
}

getdata(query.query1).then((data)=>{
    console.log(data.data.user);
    
})
getdata(query.query2).then((data)=>{
    console.log(data.data.transaction);
    
})
getdata(query.query3).then((data)=>{
    console.log(data.data.user);
    
})

