import { useContext } from "react"
import ResumeContext from "./resumeProvider"


const useResume = () => {
  return useContext(ResumeContext)
}

export default useResume