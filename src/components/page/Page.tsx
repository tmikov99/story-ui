import { Avatar, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Link, Stack, styled, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
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
import { getStatFormatting } from "../../utils/formatStory";
import { gray } from "../../theme/themePrimitives";
import { ChoiceData, StoryItem } from "../../types/page";

const InactiveChoice = styled(Typography)(({ theme }) => ({
    color: theme.palette.action.disabled,
    display: 'inline',
}));

const missingChoiceItems = (choice: ChoiceData, inventory: StoryItem[]) => {
    return choice.requiredItems 
        ? choice.requiredItems.filter(reqItem => !inventory.some(invItem => invItem.id === reqItem.id )).map(i => i.name) 
        : [];
}

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
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);

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
        <Stack direction="row" sx={{justifyContent: "space-between", mb: 2}}>
            <Button 
                variant="outlined"
                onClick={() => { page && navigate(`/story/${page.storyId}`)}}
            >
                Back to Story
            </Button>
            <Button variant="contained" onClick={() => setIsInventoryOpen(true)}>Inventory ({playthroughData.inventory.length})</Button>
        </Stack>
        <Typography sx={{mb: 1}}>🗡️ Skill: {stats?.skill} / ❤️ Stamina: {stats?.stamina} / 🍀 Luck: {stats?.luck}</Typography>
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
            {!battlePending && !luckPending && page?.choices.map((choice, index) => {
                const missingItems = missingChoiceItems(choice, playthroughData.inventory);
                return (
                    <React.Fragment key={`choice-${index}`}>
                        <br></br>
                        {missingItems.length !== 0
                            ? <InactiveChoice>{choice.text} (Missing Items: {missingItems.join(", ")})</InactiveChoice>
                            : choice.requiresLuckCheck && !playthroughData.luckPassed 
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
                )
            })}
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
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>🗡️ Skill: {battleData.playerSkill}</Typography>
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
                        <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>🗡️ Skill: {battleData.enemySkill}</Typography>
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
        <Dialog
            open={isInventoryOpen}
            onClose={() => setIsInventoryOpen(false)}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Inventory ({playthroughData.inventory.length})</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {playthroughData.inventory.map((item) =>
                        <Grid size={{xs:12, sm:6, md:4}} key={item.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                    <Avatar 
                                        variant="rounded" 
                                        sx={(theme) => ({bgcolor: theme.palette.mode === 'light' ? gray[100] : gray[600]})}
                                    >
                                        {item.icon}
                                    </Avatar>
                                    <Typography variant="h6">{item.name}</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {item.description}
                                </Typography>
                                {item.statModifiers && 
                                    <Typography variant="caption">
                                    {!!item.statModifiers.skill && <span><strong>Skill:</strong> {getStatFormatting(item.statModifiers.skill)} &nbsp;</span>}
                                    {!!item.statModifiers.skill && <span><strong>Stam:</strong> {getStatFormatting(item.statModifiers.stamina)} &nbsp;</span>}
                                    {!!item.statModifiers.skill && <span><strong>Luck:</strong> {getStatFormatting(item.statModifiers.luck)}</span>}
                                    </Typography>
                                }
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsInventoryOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
      </Box>
    )
}