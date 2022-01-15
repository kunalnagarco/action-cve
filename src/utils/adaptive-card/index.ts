import {
  ActionSet,
  AdaptiveCard,
  Container as AdaptiveCardsContainer,
  Column,
  ColumnSet,
  OpenUrlAction,
  Spacing,
  TextBlock,
  TextWeight,
  Version,
} from 'adaptivecards'

export type Container = AdaptiveCardsContainer

export const createContainer = (
  isSpacingLarge?: boolean,
  isStyleEmphasis?: boolean,
): Container => {
  const container = new AdaptiveCardsContainer()
  if (isSpacingLarge) {
    container.spacing = Spacing.Large
  }
  if (isStyleEmphasis) {
    container.style = 'emphasis'
  }
  return container
}

export type Row = ColumnSet

export const createRow = (): ColumnSet => {
  return new ColumnSet()
}

export const createTextBlock = (
  text: string,
  isBold = false,
  isWrap = true,
): TextBlock => {
  const textBlock = new TextBlock(text)
  if (isBold) {
    textBlock.weight = TextWeight.Bolder
  }
  textBlock.wrap = isWrap
  return textBlock
}

export const createColumn = (): Column => {
  return new Column()
}

export type LinkButton = ActionSet

export const createLinkButton = (text: string, url: string): LinkButton => {
  const linkButton = new ActionSet()
  const action = new OpenUrlAction()
  action.title = text
  action.url = url
  linkButton.addAction(action)
  return linkButton
}

export const createAdaptiveCard = (): AdaptiveCard => {
  const adaptiveCard = new AdaptiveCard()
  adaptiveCard.version = new Version(1, 2)
  return adaptiveCard
}
