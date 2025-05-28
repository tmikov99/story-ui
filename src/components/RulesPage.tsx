import { Container, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, styled, listItemIconClasses } from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import Inventory2Icon from '@mui/icons-material/Inventory2';

const RulesListIcon = styled(ListItemIcon)(({ theme }) => ({
  paddingRight: 16,
  '& .MuiSvgIcon-root': {
    width: 32,
    height: 32,
  },
}));

export default function RulesPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>Game Rules</Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Character Stats</Typography>
        <Typography>
          At the beginning of each adventure, your hero is assigned three core stats: <strong>Skill</strong>, <strong>Stamina</strong>, and <strong>Luck</strong>.
        </Typography>
        <List>
          <ListItem>
            <RulesListIcon><CasinoIcon /></RulesListIcon>
            <ListItemText 
              primary="Skill" 
              secondary="Roll 1 die and add 6. Represents combat prowess, reflexes, and agility." 
            />
          </ListItem>
          <ListItem>
            <RulesListIcon><CasinoIcon /></RulesListIcon>
            <ListItemText 
              primary="Stamina" 
              secondary="Roll 2 dice and add 12. Measures vitality and endurance. If this reaches 0, your adventure ends." 
            />
          </ListItem>
          <ListItem>
            <RulesListIcon><CasinoIcon /></RulesListIcon>
            <ListItemText 
              primary="Luck" 
              secondary="Roll 1 die and add 6. Indicates how fortunate you are in risky situations." 
            />
          </ListItem>
        </List>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Testing Your Luck</Typography>
        <Typography>
          Occasionally, you'll have the option to <strong>Test your Luck</strong>. This involves rolling two dice:
        </Typography>
        <Typography>
          If the result is equal to or below your current Luck score, you succeed and something favorable happens.
          If it's higher, you fail and may suffer negative consequences.
        </Typography>
        <Typography>
          <strong>Important:</strong> Every time you test your luck, your Luck score decreases by 1 point.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Combat</Typography>
        <Typography>
          Combat is turn-based and consists of one or more <strong>Attack Rounds</strong>. Each round works like this:
        </Typography>
        <List>
          <ListItem>
            <RulesListIcon><SportsKabaddiIcon /></RulesListIcon>
            <ListItemText 
              primary="Step 1" 
              secondary="Roll 2 dice and add your Skill score — this is your Attack Strength." 
            />
          </ListItem>
          <ListItem>
            <RulesListIcon><SportsKabaddiIcon /></RulesListIcon>
            <ListItemText 
              primary="Step 2" 
              secondary="Your opponent does the same. Compare the totals." 
            />
          </ListItem>
          <ListItem>
            <RulesListIcon><SportsKabaddiIcon /></RulesListIcon>
            <ListItemText 
              primary="Step 3" 
              secondary="The one with the higher Attack Strength inflicts 2 points of damage to the other's Stamina." 
            />
          </ListItem>
        </List>
        <Typography>
          If both sides tie, neither takes damage. Combat continues until one participant’s Stamina hits zero.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Using Luck in Combat</Typography>
        <Typography>
          During a battle, you may choose to <strong>Test your Luck</strong> to alter the effects of damage.
        </Typography>
        <List>
          <ListItem>
            <RulesListIcon><CasinoIcon /></RulesListIcon>
            <ListItemText 
              primary="When attacking" 
              secondary="If lucky, you deal extra damage. If unlucky, you deal less damage." 
            />
          </ListItem>
          <ListItem>
            <RulesListIcon><CasinoIcon /></RulesListIcon>
            <ListItemText 
              primary="When defending" 
              secondary="If lucky, you reduce the damage taken. If unlucky, you suffer more damage." 
            />
          </ListItem>
        </List>
        <Typography>
          This adds risk and reward to every round of combat.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Items and Inventory</Typography>
        <Typography>
          Throughout your journey, you’ll find various items: weapons, potions, keys, tools, and more.
        </Typography>
        <Typography>
          Items are added to or removed from your inventory depending on the page you're on. Pay attention - some choices require that you carry specific items to proceed or unlock new paths.
        </Typography>
        <List>
          <ListItem>
            <RulesListIcon><Inventory2Icon /></RulesListIcon>
            <ListItemText 
              primary="Granted Items" 
              secondary="Some pages will give you useful items to help in your quest." 
            />
          </ListItem>
          <ListItem>
            <RulesListIcon><Inventory2Icon /></RulesListIcon>
            <ListItemText 
              primary="Removed Items" 
              secondary="Occasionally, you’ll need to give up items to progress." 
            />
          </ListItem>
          <ListItem>
            <RulesListIcon><Inventory2Icon /></RulesListIcon>
            <ListItemText 
              primary="Required Items" 
              secondary="Certain choices are only available if you have specific items in your inventory." 
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};