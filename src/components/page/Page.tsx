import { Link, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageData } from "../../types/page";
import { fetchPage } from "../../api/page";
import { useUserPlaythrough } from "../../hooks/useUserPlaythrough";


export default function Page() {
    const {storyId, pageNumber} = useParams();
    const navigate = useNavigate();
    const { savePage } = useUserPlaythrough(Number(storyId));
    const [page, setPage] = useState<PageData | null>(null);

    useEffect(() => {
        fetchPage(Number(storyId), Number(pageNumber)).then((page) => {
            setPage(page);
        })
    },[pageNumber]);

    const handleChoice = (targetPage: number) => {
        savePage(targetPage);
        navigate(`/story/${storyId}/page/${targetPage}`);
    }

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
            <Typography variant="h2" gutterBottom style={{textAlign: "center"}}>{page?.pageNumber}</Typography>
            <br></br>
            {page?.paragraphs.map((paragraph, index) => <Typography variant="body1" key={index} gutterBottom >{paragraph}</Typography>)}
            {page?.choices.map((choice, index) => <>
                <br></br>
                <Link onClick={() => handleChoice(choice.targetPage)} key={index} sx={{ cursor: "pointer" }}>{choice.text}</Link>
            </>)}
        </Paper>
      </Box>
    )
}