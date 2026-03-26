import { useState } from "react"
import { GitHubList } from "./GitHubList"
import {Response}  from "../DTO/response.dto"

export const GitForm = () => {
    const [lista, setLista] = useState<Response[]>([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGetInfo = async () => {
        if (!name.trim()) return; 

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/test/github-data", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: name 
                }),
            });

            if (!response.ok) {
                throw new Error("Error al obtener datos de GitHub");
            }

            const data = await response.json();
            setLista(data); 

        } catch (error) {
            console.error("Hubo un fallo:", error);
            alert("No se pudo encontrar al usuario o el servidor está caído");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="w-[40rem] p-10 bg-white rounded-[35px] ">
            <div className='flex  '>
                <div className='flex-2'>
                <div className=" bg-[#0d152b] w-[10rem] h-[10rem] rounded-full"></div>
            </div>
            <div className='flex-1 pl-[3rem]'>
                <h1 className='font-bold text-xl pb-3'>Informacion del usuario</h1>
                <div className="pb-3">
                    <h2 className="">Nombre</h2>
                    <div className="w-[20rem] h-[2rem] bg-gray-300 rounded-lg"></div>
                </div>
                <div className="pb-3">
                    <h2 className="">Apellido</h2>
                    <div className="w-[20rem] h-[2rem] bg-gray-300 rounded-lg"></div>
                </div>
            </div>
            </div>
            <div className='pt-5'>
                <h1 className='font-bold text-xl pb-3'>Enlazar cuenta GitHub</h1>
                <input type="text" className="w-full text-[12px] px-2 py-3 border  border-gray-400 rounded-xl outline-none" placeholder='Ingrese su nombre de usuario' value={name} required onChange={(e)=>setName(e.target.value)}/>
                <button 
                    onClick={handleGetInfo}
                    disabled={loading}
                    className={`mt-8 w-full py-3 rounded-lg text-white font-medium transition-colors ${
                        loading ? 'bg-gray-500' : 'bg-[#131231] hover:bg-[#1e1d4d]'
                    }`}
                >
                    {loading ? 'Cargando...' : 'Obtener información'}
                </button>
            </div>
            {lista.length >0 && (
                <div className='px-6 py-3 w-full bg-gray-300 rounded-xl mt-6'>
                    <GitHubList list={lista}/>
                </div>)}
            
        </div>
    )
}
