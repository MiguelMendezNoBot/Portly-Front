import {Response} from '../DTO/response.dto'

interface Props{
    list: Response[],
}
const listaPrueba:Response[] = [
    {
        "name": "1erProyectoReact",
        "language": null,
        "html_url": "https://github.com/CrhistoferVera/1erProyectoReact",
        "stargazers_count": 0
    },
    {
        "name": "Clinica-Dental",
        "language": "JavaScript",
        "html_url": "https://github.com/CrhistoferVera/Clinica-Dental",
        "stargazers_count": 0
    },
    {
        "name": "crhistofervera",
        "language": null,
        "html_url": "https://github.com/CrhistoferVera/crhistofervera",
        "stargazers_count": 0
    },
    {
        "name": "hello-git",
        "language": null,
        "html_url": "https://github.com/CrhistoferVera/hello-git",
        "stargazers_count": 0
    },
    {
        "name": "LibraryApplication",
        "language": "Java",
        "html_url": "https://github.com/CrhistoferVera/LibraryApplication",
        "stargazers_count": 0
    },
    {
        "name": "oktava-frontend-web",
        "language": "TypeScript",
        "html_url": "https://github.com/CrhistoferVera/oktava-frontend-web",
        "stargazers_count": 0
    },
    {
        "name": "portly-backend",
        "language": "Java",
        "html_url": "https://github.com/CrhistoferVera/portly-backend",
        "stargazers_count": 0
    },
    {
        "name": "PrimerProyectoReact",
        "language": null,
        "html_url": "https://github.com/CrhistoferVera/PrimerProyectoReact",
        "stargazers_count": 0
    },
    {
        "name": "TresEnRaya",
        "language": "Java",
        "html_url": "https://github.com/CrhistoferVera/TresEnRaya",
        "stargazers_count": 0
    },
    {
        "name": "UrlShortener_Backend",
        "language": "Java",
        "html_url": "https://github.com/CrhistoferVera/UrlShortener_Backend",
        "stargazers_count": 0
    },
    {
        "name": "UrlShortener_Frontend",
        "language": "JavaScript",
        "html_url": "https://github.com/CrhistoferVera/UrlShortener_Frontend",
        "stargazers_count": 0
    },
    {
        "name": "UserManagment-frontend-i18n",
        "language": "TypeScript",
        "html_url": "https://github.com/CrhistoferVera/UserManagment-frontend-i18n",
        "stargazers_count": 0
    }
]

export const GitHubList = ({list}:Props) => {
    return (
        <div>{list.map((rowItem:Response)=>(
            <div>{rowItem.name}</div>
        ))}
        </div>
    )
}
