const Url = "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql";
const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5OCIsImlhdCI6MTczOTg5NTU3OSwiaXAiOiIxMC4xLjguMSwgMTcyLjE4LjAuMiIsImV4cCI6MTczOTk4MTk3OSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtY2FtcHVzZXMiOiJ7fSIsIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiOTgiLCJ4LWhhc3VyYS10b2tlbi1pZCI6ImUxYTNlNzIxLTZkOGUtNDU4MC04YWY3LWRmYTcyZTFlYjNlYSJ9fQ.5u8TraEVzxSMZmxil1Dbo8fKvq1kWazJ_FioNWpsyto";

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

console.log(getdata());
console.log(getdata());
console.log(getdata());

