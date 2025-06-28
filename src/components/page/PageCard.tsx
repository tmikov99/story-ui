import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArticleIcon from '@mui/icons-material/Article';
import Button from '@mui/material/Button';
import { PageData } from '../../types/page';
import { Stack, Chip } from '@mui/material';
import { getStatFormatting } from '../../utils/formatStory';

const SyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
  '&[data-active]': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
  },
}));

const SyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  paddingLeft: 16,
  paddingRight: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const StyledTypographyLarge = styled(StyledTypography)({
  WebkitLineClamp: 4,
})

interface PageCardProps {
  page: PageData;
  onClick?: (page: PageData) => void;
  selected?: boolean;
  onMenuOpen?: (e: React.MouseEvent<HTMLElement>, page: PageData) => void;
}

const handleButtonClickPlaceholder = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.stopPropagation();
};


export default function PageCard({ page, onClick, onMenuOpen, selected }: PageCardProps) {
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    onMenuOpen?.(event, page);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(page);
    }
  }

  return (
    <SyledCard onClick={handleCardClick} data-active={selected ? '' : undefined}>
      <CardHeader
        sx={{paddingLeft: 2, paddingTop: 2, paddingRight: 2}}
        avatar={
          <ArticleIcon />
        }
        action={
          <IconButton onClick={handleMenuOpen} aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={<StyledTypography>{page?.title}</StyledTypography>}
        subheader={`Page ${page?.pageNumber}`}
      />
      <SyledCardContent>
        <StyledTypographyLarge variant="body2" sx={{ color: 'text.secondary' }}>
          {page?.paragraphs && page.paragraphs[0]}
        </StyledTypographyLarge>
        <Stack direction="row" gap={1} sx={{ px: 1, flexWrap: 'wrap' }}>
          {page.choices.length === 0 && <Chip label="🏁 End Page" color="success" size="small" />}
          {page.enemy && (
            <Chip
              label={`👹 Enemy: ${page.enemy.enemyName}`}
              color="error"
              size="small"
              variant="outlined"
            />
          )}
          {page.luckRequired && <Chip label="🍀 Requires Luck" color="warning" size="small" />}
          {(!!page.statModifiers?.skill || !!page.statModifiers?.stamina || !!page.statModifiers?.luck) && (
            <Chip
              label={`⚙️ Stats: ${getStatFormatting(page.statModifiers.skill)} SK / ${getStatFormatting(page.statModifiers.stamina)} ST / ${getStatFormatting(page.statModifiers.luck)} LK`}
              color="info"
              size="small"
            />
          )}
          {page.itemsGranted && page.itemsGranted?.length > 0 && (
            <Chip
              label={`🎁 Gives: ${page.itemsGranted.map((item) => item.icon || "📦").join(" ")}`}
              color="success"
              size="small"
              variant="outlined"
            />
          )}
          {page.itemsRemoved && page.itemsRemoved?.length > 0 && (
            <Chip
              label={`🗑️ Removes: ${page.itemsRemoved.map((item) => item.icon || "📦").join(" ")}`}
              color="warning"
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
      </SyledCardContent>
      <CardActions disableSpacing sx={{paddingLeft: 2, paddingRight: 2, paddingBottom: 2}}>
        <Button onClick={handleButtonClickPlaceholder} color="info" variant="text" size="small">Paragraphs: {page?.paragraphs.length}</Button>
        <Button onClick={handleButtonClickPlaceholder} sx={{ marginLeft: "auto" }} color="error" variant="text" size="small">Choices: {page?.choices.length}</Button>
      </CardActions>
    </SyledCard>
  );
}