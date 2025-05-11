import { Button, Link, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageData } from "../../types/page";
import { chooseNextPage, fetchPlaythroughCurrentPage } from "../../api/playthrough";
import React from "react";

export default function Page() {
    const { playthroughId } = useParams();
    const numericPlaythroughId = Number(playthroughId); //TODO: finally research this
    const navigate = useNavigate();
    const [page, setPage] = useState<PageData | null>(null);

    useEffect(() => {
        try {
            fetchPlaythroughCurrentPage(Number(playthroughId)).then((page) => {
                setPage(page);
            })
        } catch (error) {
            console.error("Failed to fetch playthrough current page", error);
        }
    },[playthroughId]);

    const handleChoice = async (targetPage: number) => {
        try {
            const nextPage = await chooseNextPage(numericPlaythroughId, targetPage);
            setPage(nextPage);
        } catch (error) {
            console.error("Failed to make choice", error);
        }
    }

    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        {page && 
            <Button 
                variant="outlined"
                onClick={() => navigate(`/story/${page.storyId}`)}
                sx={{ mb: 2 }}
            >
                Back to Story
            </Button>
        }
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
            {page?.paragraphs.map((paragraph, index) => <Typography variant="body1" key={`paragraph-${index}`} gutterBottom >{paragraph}</Typography>)}
            {page?.choices.map((choice, index) => (
                <React.Fragment key={`choice-${index}`}>
                    <br></br>
                    <Link onClick={() => handleChoice(choice.targetPage)} key={`choice-${index}`} sx={{ cursor: "pointer" }}>{choice.text}</Link>
                </React.Fragment>
            ))}
            {page?.choices.length === 0 && (
                <>
                    <br />
                    <Typography variant="h5" color="text.secondary" align="center" sx={{ mt: 4 }}>
                        🔚 The End - this path has reached its conclusion.
                    </Typography>
                    <Box display="flex" justifyContent="center" gap={2} mt={2}>
                    <Link onClick={() => navigate(`/story/${page.storyId}`)} sx={{ cursor: "pointer" }}>
                        Back to Story Overview
                    </Link>
                    <Link onClick={() => navigate('/')} sx={{ cursor: "pointer" }}>
                        Discover More Stories
                    </Link>
                    </Box>
                </>
                )}
        </Paper>
      </Box>
    )
}