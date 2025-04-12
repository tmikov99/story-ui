import { Button, Link, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JSX } from "react/jsx-runtime";
import { PageData } from "../types/page";
import { fetchPage } from "../api/page";
import { useUserPlaythrough } from "../hooks/useUserPlaythrough";

const testList: JSX.Element[] = [<Typography variant="h2" gutterBottom style={{textAlign: "center"}}>Page Number</Typography>,<br />];
for (let i = 0; i < 50; i++) {
    testList.push(<Typography variant="body1" gutterBottom >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>  )
}

testList.push(<br/>)
testList.push(<Link href="#">To go north, turn to 214</Link>)
testList.push(<br/>)
testList.push(<Link href="#">To go north, turn to 253</Link>)


export default function Page() {
    const {storyId, pageId} = useParams();
    const navigate = useNavigate();
    const { savePage } = useUserPlaythrough(Number(storyId));
    const [page, setPage] = useState<PageData | null>(null);

    useEffect(() => {
        fetchPage(Number(pageId)).then((page) => {
            setPage(page);
        })
    },[pageId]);

    const handleChoice = (targetPage: number) => {
        savePage(targetPage);
        navigate(`/story/${storyId}/page/${targetPage}`);
    }

    console.log("storyID: ", storyId, "pageId:", pageId)
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Paper 
            elevation={3}
            sx={{
                paddingLeft: {xs: 4, md: 8, lg: 12, xl: 16}, 
                paddingRight: {xs: 4, md: 8, lg: 12, xl: 16},
                paddingTop: 8, 
                paddingBottom: 8, 
                marginLeft: {xs: 2, sm: 4, md: 8, lg: 12, xl: 16},
                marginRight: {xs: 2, sm: 4, md: 8, lg: 12, xl: 16}, 
                position: "relative",
            }}
        >
            <Typography variant="h2" gutterBottom style={{textAlign: "center"}}>Page Number</Typography>
            <br></br>
            {page?.paragraphs.map((paragraph, index) => <Typography variant="body1" key={index} gutterBottom >{paragraph}</Typography>)}
            {page?.choices.map((choice, index) => <>
                <br></br>
                <Link onClick={() => handleChoice(choice.targetPage)} key={index} sx={{ cursor: "pointer" }}>{choice.text}</Link>
            </>)}

            {/* <Typography variant="subtitle1" sx={{textAlign: "center", position: "absolute", bottom: '8px', left: 0, right: 0}}>210</Typography> */}
        </Paper>
        {/* <Typography variant="subtitle1" sx={{textAlign: "center"}}>210</Typography> */}
      </Box>
    )
}