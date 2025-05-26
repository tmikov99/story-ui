import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, Stack, styled, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {  continueNextRound, doRollsInBattle, fetchBattle, fetchPlaythrough, finishBattle, makePlaythroughChoice, performLuckCheck, sendStartBattle, useLuckInBattle } from "../../api/playthrough";
import React from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/snackbarSlice";
import { Battle, PlaythroughData } from "../../types/playthrough";

const InactiveChoice = styled(Typography)(({ theme }) => ({
    color: theme.palette.action.disabled,
    display: 'inline',
}));

export default function Page() {
    const { playthroughId } = useParams();
    const numericPlaythroughId = Number(playthroughId); //TODO: finally research this
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [playthroughData, setPlaythroughData] = useState<PlaythroughData | null>(null);
    const [battleData, setBattleData] = useState<Battle | null>(null);
    const [isBattleDialogOpen, setBattleDialogOpen] = useState(false);

    useEffect(() => {
        try {
            fetchPlaythrough(Number(playthroughId)).then((data) => {
                setPlaythroughData(data);
                setBattleData(data.battle)
            });
        } catch (error) {
            dispatch(showSnackbar({ message: "Failed to fetch playthrough current page", severity: "error" }));
        }
    },[playthroughId]);

    if (!playthroughData) {
        return <div>Loading...</div>
    }
    const page = playthroughData.page;
    const stats = playthroughData.stats;
    const battlePending = playthroughData.battlePending;
    const luckPending = playthroughData.luckRequired && !playthroughData.luckPassed;

    const handleChoice = async (choiceId: number | undefined) => {
        if (!choiceId) {
            return;
        }
        try {
            const playthrough = await makePlaythroughChoice(numericPlaythroughId, choiceId)
            setPlaythroughData(playthrough);
        } catch (error) {
            dispatch(showSnackbar({ message: "Failed to make choice.", severity: "error" }));
        }
    }

    const handleLuckCheck = async () => {
        try {
            const luckCheckResponse = await performLuckCheck(numericPlaythroughId);
            setPlaythroughData(luckCheckResponse.playthrough);
            console.log(luckCheckResponse);
        } catch (error) {
            dispatch(showSnackbar({ message: "Failed to perform luck test.", severity: "error" }));
        }
    }

    const handleBattleStart = async () => {
        try {
            let response = battleData ? await fetchBattle(numericPlaythroughId) : await sendStartBattle(numericPlaythroughId);
            console.log(response)
            setBattleData(response);
            setBattleDialogOpen(true);
        } catch (error) {
            dispatch(showSnackbar({ message: "Failed to start battle", severity: "error" }));
        }
    };

    const handleRolls = async () => {
        try {
            const newData = await doRollsInBattle(numericPlaythroughId);
            setBattleData(newData);
        } catch (error) {
            dispatch(showSnackbar({ message: "Failed to do battle roll", severity: "error" }));
        }
    }

    const handleUseLuckInBattle = async () => {
        try {
            const newData = await useLuckInBattle(numericPlaythroughId);
            setBattleData(newData);
        } catch (error) {
            dispatch(showSnackbar({ message: "Failed to perform luck check in battle", severity: "error"}));
        }
    }

    const handleContinueBattle = async () => {
        try {
            const newData = await continueNextRound(numericPlaythroughId);
            setBattleData(newData);
        } catch (error) {
            dispatch(showSnackbar({ message: "Failed to continue battle", severity: "error"}));
        }
    }

    const handleFinishBattle = async () => {
        const playthrough = await finishBattle(numericPlaythroughId);
        setPlaythroughData(playthrough);
        setBattleDialogOpen(false);
    }

    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Button 
            variant="outlined"
            onClick={() => { page && navigate(`/story/${page.storyId}`)}}
            sx={{ mb: 2 }}
        >
            Back to Story
        </Button>
        <Typography>Skill: {stats?.skill} / Stamina: {stats?.stamina} / Luck: {stats?.luck}</Typography>
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
            {battlePending && (
                <Box sx={{textAlign: 'center'}}>
                    <br></br>
                    <Button 
                        variant="contained" 
                        size="large" 
                        onClick={handleBattleStart}
                    >
                        {battleData ? "Continue Battle" : "Start Battle"}
                    </Button>
                </Box>
            )}
            {!battlePending && luckPending && (
                <Box sx={{textAlign: 'center'}}>
                    <br></br>
                    <Button variant="contained" size="large" onClick={handleLuckCheck}>Test Your Luck</Button>
                </Box>
            )}
            {!battlePending && !luckPending && page?.choices.map((choice, index) => (
                <React.Fragment key={`choice-${index}`}>
                    <br></br>
                    {choice.requiresLuckCheck && !playthroughData.luckPassed 
                        ? <InactiveChoice>{choice.text} (Luck Test Failed)</InactiveChoice>
                        : <Link 
                            onClick={() => 
                            handleChoice(choice.id)} 
                            key={`choice-${index}`} 
                            sx={{ cursor: "pointer" }}
                          >
                            {choice.text} {choice.requiresLuckCheck && `(Luck Test Passed)`}
                          </Link>
                    }
                    <br></br>
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
        <Dialog open={isBattleDialogOpen} onClose={() => setBattleDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Battle Against {battleData?.enemyName}</DialogTitle>
            <DialogContent dividers>
                {battleData ? (
                    <Box>
                        <Typography>Player - Skill: {battleData.playerSkill} / Stamina: {battleData.playerStamina} / Luck: {battleData.playerLuck}</Typography>
                        <Typography>Player Roll: {battleData.lastPlayerRoll}</Typography>
                        <br></br>
                        <Typography>{battleData.enemyName} - Skill: {battleData.enemySkill} / Stamina: {battleData.enemyStamina}</Typography>
                        <Typography>Enemy Roll: {battleData.lastEnemyRoll}</Typography>
                        <br></br>
                        <Typography variant="body2">{battleData.battleLog}</Typography>
                        <Box sx={{mt: 2}}>
                            {battleData.completed 
                                ?   <Button
                                        variant="contained" 
                                        size="large" 
                                        sx={{ display: "block", margin: "auto", width: 200}}
                                        onClick={handleFinishBattle}
                                    >
                                        Finish Battle
                                    </Button>
                                : battleData.roundFinalized 
                                    ? <Button
                                        variant="contained" 
                                        size="large" 
                                        sx={{ display: "block", margin: "auto", width: 200}}
                                        onClick={handleRolls}
                                    >
                                        Roll
                                    </Button>
                                    : <Box sx={{textAlign: "center"}}>
                                        {battleData.pendingDamageTarget !== "NONE" && 
                                            <Button 
                                                variant="contained" 
                                                sx={{width: 200, margin: 1}}
                                                onClick={handleUseLuckInBattle}
                                            >
                                                Use Luck
                                            </Button>
                                        }
                                        <Button 
                                            variant="contained" 
                                            sx={{width: 200, margin: 1}}
                                            onClick={handleContinueBattle}
                                        >
                                            Continue
                                        </Button>
                                    </Box>
                            }
                        </Box>
                    </Box>
                ) : (
                    <Typography>Loading battle data...</Typography>
                )}
            </DialogContent>
            {/* <DialogActions>
                <Button variant="outlined" onClick={() => setBattleDialogOpen(false)}>Close</Button>
            </DialogActions> */}
        </Dialog>
      </Box>
    )
}