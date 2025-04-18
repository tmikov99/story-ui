import { Button, IconButton, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { ChangeEvent, useEffect, useState } from "react";
import { ChoiceData, PageData } from "../types/page";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from "react-router-dom";
import { createPage, fetchPageById, updatePage } from "../api/page";

type PageFormProps = {
    pageId?: number;
};

export default function PageCreate({ pageId }: PageFormProps) {
    const {storyId} = useParams();
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState<number | "">("");
    const [title, setTitle] = useState('');
    const [paragraphs, setParagraphs] = useState(['']);
    const [choices, setChoices] = useState([{ text: '', targetPage: '' }]);

    useEffect(() => {
        if (pageId) {
          fetchPageById(pageId).then((data) => {
            setPageNumber(data.pageNumber);
            setTitle(data.title);
            setParagraphs(data.paragraphs || []);
            setChoices(data.choices || []);
          });
        }
      }, [pageId]);

    const handleParagraphChange = (index: number, value: string) => {
        const updated = [...paragraphs];
        updated[index] = value;
        setParagraphs(updated);
    };
    
    const addParagraph = () => {
        setParagraphs(prev => [...prev, '']);
    };
    
    const removeParagraph = (index: number) => {
        setParagraphs(prev => prev.filter((_, i) => i !== index));
    };
    
    const handleChoiceChange = (index: number, field: keyof ChoiceData, value: string) => {
        const updated = [...choices];
        updated[index][field] = value;
        setChoices(updated);
    };
    
    const addChoice = () => {
        setChoices(prev => [...prev, { text: '', targetPage: '' }]);
    };
    
    const removeChoice = (index: number) => {
        setChoices(prev => prev.filter((_, i) => i !== index));
    };
    
    const handleSubmit = async () => {
        console.log(choices)
        const storyIdNumber = Number(storyId);
        const pageData: PageData = {
          title,
          storyId: storyIdNumber,
          pageNumber: Number(pageNumber),
          paragraphs: paragraphs.filter(p => p.trim() !== ''),
          choices: choices.filter(choice => choice.text.trim() && choice.targetPage).map(choice => ({
            text: choice.text,
            targetPage: Number(choice.targetPage),
          })),
          endPage: false,
        };
    
        console.log("Submitting page:", pageData);
        
        if (pageId) {
            await updatePage(pageId, pageData);
        } else {
            await createPage(pageData);
        }

        navigate(`/create/${storyId}/overview`)
    };
    
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
            }}
        >
            <TextField
                fullWidth
                type="number"
                label="Page Number"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value === "" ? "" : Number(e.target.value))}
                sx={{ mb: 4, maxWidth: 160 }}
            />
            <TextField
                fullWidth
                label="Page Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{mb: 8}}
            />
            <Typography variant="h6" sx={{ mb: 2 }}>Paragraphs</Typography>
            {paragraphs.map((para, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <TextField
                        multiline
                        fullWidth
                        value={para}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleParagraphChange(idx, e.target.value)
                        }
                        placeholder={`Paragraph ${idx + 1}`}
                        sx={{ flexGrow: 1 }}
                    />
                    <IconButton onClick={() => removeParagraph(idx)} sx={{ ml: 2 }}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}
            <Button variant="outlined" onClick={addParagraph} sx={{ mb: 4 }}>Add Paragraph</Button>

            <Typography variant="h6" sx={{ mb: 2 }}>Choices</Typography>
            {choices.map((choice, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <TextField
                        placeholder={`Choice ${idx + 1}`}
                        value={choice.text}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChoiceChange(idx, 'text', e.target.value)
                        }
                        fullWidth
                    />
                    <TextField
                        label="Target Page"
                        type="text"
                        value={choice.targetPage}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChoiceChange(idx, 'targetPage', e.target.value)
                        }
                        sx={{ width: 200 }}
                    />
                    <IconButton onClick={() => removeChoice(idx)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}
            <Button variant="outlined" onClick={addChoice} sx={{ mb: 4 }}>Add Choice</Button>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button variant="contained" onClick={handleSubmit}>Submit Page</Button>
            </Box>
        </Paper>
      </Box>
    )
}