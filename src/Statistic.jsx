import "./Statistic.css"

const Statistic = ({name, value}) => {

    let skillPoint = []
    for(let i = 1; i <= 10; i++){
        let li
        let cl

        if( i <= value){
            cl = "skillPoint skillPoint-acquired"
        }else{
            cl ="skillPoint"
        }

        switch(value){
            case 10:
                li = <li key={i} className={cl} relic={"true"}/>
                break
            case 9:
                li = <li key={i} className={cl} legendary={"true"}/>
                break
            case 8:
                li = <li key={i} className={cl} mythical={"true"}/>
                break
            case 7:
                li = <li key={i} className={cl} rare={"true"}/>
                break
            case 6:
                li = <li key={i} className={cl} uncommon={"true"}/>
                break
            default:
                li = <li key={i} className={cl} common={"true"}/>
                break
        }

        skillPoint.push(li)
    }

    return(
        <>
            <div className="skill">
                <h5 className="skill-name">{name}</h5>
                <div className="skillPoint-line">
                    {skillPoint}
                </div>
            </div>
        </>
    )
}

export default Statistic