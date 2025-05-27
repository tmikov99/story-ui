import { Button, Dialog, DialogContent, DialogTitle, Link, styled, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {  continueNextRound, doRollsInBattle, fetchBattle, fetchPlaythrough, finishBattle, makePlaythroughChoice, performLuckCheck, sendStartBattle, useLuckInBattle } from "../../api/playthrough";
import React from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/snackbarSlice";
import { Battle, PlaythroughData } from "../../types/playthrough";
import CountUp from "react-countup";

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
    const [isLuckDialogOpen, setLuckDialogOpen] = useState(false);
    const [luckCheckResult, setLuckCheckResult] = useState<{ diceRoll: number; passed: boolean } | null>(null);

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
            setBattleData(playthrough.battle)
        } catch (error) {
            dispatch(showSnackbar({ message: "Failed to make choice.", severity: "error" }));
        }
    }

    const handleLuckCheck = async () => {
        try {
            const luckCheckResponse = await performLuckCheck(numericPlaythroughId);
            setPlaythroughData(luckCheckResponse.playthrough);
            setLuckCheckResult({ diceRoll: luckCheckResponse.diceRoll, passed: luckCheckResponse.passed });
            setLuckDialogOpen(true);
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
                            &gt; {choice.text} {choice.requiresLuckCheck && `(Luck Test Passed)`}
                          </Link>
                    }
                    <br></br>
                </React.Fragment>
            ))}
            {!battlePending && page?.choices.length === 0 && (
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
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                ⚔️ Battle Against {battleData?.enemyName} 🛡️
            </DialogTitle>
            <DialogContent dividers>
                {battleData ? (
                <Box>
                    {/* Player Section */}
                    <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>🧍‍♂️ You</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        ❤️ Stamina:{' '}
                        <CountUp end={battleData.playerStamina} duration={0.8} separator="," preserveValue={true}/>
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 0.5 }}>
                        🎲 Roll:{' '}
                        <CountUp end={battleData.lastPlayerRoll} duration={0.5} preserveValue={true}/>
                        <Typography variant="h6" color="text.secondary" display="inline"> + {battleData.playerSkill}</Typography>
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>💪 Skill: {battleData.playerSkill}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>🍀 Luck: {battleData.playerLuck}</Typography>
                    </Box>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }} />

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>👹 {battleData.enemyName}</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            ❤️ Stamina:{' '} 
                            <CountUp end={battleData.enemyStamina} duration={0.8} separator="," preserveValue={true}/>
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 0.5 }}>
                            🎲 Roll:{' '}
                            <CountUp end={battleData.lastEnemyRoll} duration={0.5} preserveValue={true}/>
                            <Typography variant="h6" color="text.secondary" display="inline"> + {battleData.enemySkill}</Typography>
                        </Typography>
                        <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>💪 Skill: {battleData.enemySkill}</Typography>
                    </Box>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }} />
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                            📝 {battleData.battleLog}
                        </Typography>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            {battleData.completed ? (
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    sx={{ width: 200, m: 1 }}
                                    onClick={handleFinishBattle}
                                >
                                    ✅ Finish Battle
                                </Button>
                            ) : battleData.roundFinalized ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ width: 200, m: 1 }}
                                    onClick={handleRolls}
                                >
                                    🎲 Roll
                                </Button>
                            ) : (
                                <>
                                    {battleData.pendingDamageTarget !== "NONE" && (
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            sx={{ width: 200, m: 1 }}
                                            onClick={handleUseLuckInBattle}
                                        >
                                            🍀 Use Luck
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        sx={{ width: 200, m: 1 }}
                                        onClick={handleContinueBattle}
                                    >
                                        🔁 Continue
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                ) : (
                <Typography textAlign="center">⏳ Loading battle data...</Typography>
                )}
            </DialogContent>
        </Dialog>
        <Dialog open={isLuckDialogOpen} onClose={() => {setLuckDialogOpen(false); setLuckCheckResult(null);}} maxWidth="xs" fullWidth>
            <DialogContent dividers>
                {luckCheckResult && (
                    <Box textAlign="center">
                        <Typography variant="h6">You rolled a {luckCheckResult.diceRoll}!</Typography>
                        <Typography variant="h5" color={luckCheckResult.passed ? "success.main" : "error.main"}>
                            {luckCheckResult.passed ? "You passed the Luck Check! 🍀" : "You failed the Luck Check. 😞"}
                        </Typography>
                        <Box mt={2}>
                            <Button variant="contained" onClick={() => setLuckDialogOpen(false)}>
                                Continue
                            </Button>
                        </Box>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
      </Box>
    )
}