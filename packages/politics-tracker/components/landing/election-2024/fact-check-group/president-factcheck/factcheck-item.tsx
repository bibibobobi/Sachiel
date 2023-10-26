import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import type { Politic } from '~/components/landing/election-2024/fact-check-group'
import CandidateInfo from '~/components/landing/election-2024/fact-check-group/president-factcheck/candidate-info'
import LinkButtons from '~/components/landing/election-2024/fact-check-group/president-factcheck/link-button'
import PoliticContent from '~/components/politics/politic-content'
import SwitchArrowLeft from '~/public/icons/landing/switch-arrow-left.svg'
import SwitchArrowRight from '~/public/icons/landing/switch-arrow-right.svg'
import type { PoliticCategory } from '~/types/politics-detail'

const Wrapper = styled.div`
  width: 100%;
  border-radius: 40px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.backgroundColor.white};
  max-width: 400px;
  margin: auto;

  ${({ theme }) => theme.breakpoint.md} {
    max-width: 330px;
    margin: 0;
  }
`

const Content = styled.div`
  padding: 16px;
`

const PoliticDesc = styled.div`
  position: relative;
  color: #0f2d35;
  text-align: justify;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.8;
  margin-bottom: 20px;
`

const Category = styled.span`
  display: inline-block;
  padding: 4px 8px;
  text-align: center;
  border-radius: 32px;
  background: #0f2d35;
  color: #ffffff;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 14px;
  width: fit-content;

  & + * {
    margin-top: 4px;
  }
`

const SwitchPanel = styled.div<{ hasPolitics: boolean }>`
  padding: 0px 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  //dashed style
  background-image: linear-gradient(
    to right,
    rgba(15, 45, 53, 0.1) 50%,
    transparent 50%
  );
  background-size: 12px 1px;
  background-repeat: repeat-x;
  background-position: bottom;

  .switch-arrow {
    display: ${({ hasPolitics }) => (hasPolitics ? 'block' : 'none')};

    &:hover {
      opacity: 0.5;
      cursor: pointer;
    }
  }
`

const Feedback = styled.div`
  width: 100%;
  height: 24px;
  background-color: rgba(15, 45, 53, 0.5);
`

const DevMode = styled.div`
  width: 100%;
  font-size: 12px;
  margin-bottom: 20px;

  > span {
    margin-right: 4px;
  }
`

//FIXME: combine with PoliticDesc ?
const DefaultDec = styled.div`
  color: rgba(15, 45, 53, 0.3);
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.8;
  margin-bottom: 20px;
`

const Loading = styled.div`
  width: 100%;

  .skeleton {
    background: linear-gradient(90deg, #ffffff 25%, #eeeeee 50%, #ffffff 75%);
    background-size: 200% 100%;
    animation: loading 3s infinite ease-in-out;
    margin-bottom: 20px;
    height: 20px;

    max-width: 240px;
    margin: auto;
    margin-bottom: 8px;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`

type FactCheckItemProps = {
  candidate: any
  selectedCategory: PoliticCategory
  filterLabels: string[]
  isLoading: boolean
}
export default function FactCheckItem({
  candidate,
  selectedCategory,
  filterLabels,
  isLoading,
}: FactCheckItemProps): JSX.Element {
  const { person_id, politics } = candidate

  // 當 filterLabels（ checkbox 篩選條件）變動時，將 politics 重新篩選
  const [pickedPolitics, setPickedPolitics] = useState(politics)

  useEffect(() => {
    const filterPoliticsByCount = (politics: Politic[], labels: string[]) => {
      return politics.filter((politic) =>
        //@ts-ignore
        labels.every((label) => politic[label] > 0)
      )
    }

    const filteredPolitics = filterPoliticsByCount(politics, filterLabels)
    setPickedPolitics(filteredPolitics)
  }, [filterLabels, politics])

  //單一政見細節資訊 --------------------

  const hasPolitics = Boolean(pickedPolitics.length > 0)
  const [politicNumber, setPoliticNumber] = useState(hasPolitics ? 1 : 0)

  const politicId = pickedPolitics[politicNumber - 1]?.id || null
  const desc = pickedPolitics[politicNumber - 1]?.desc || ''
  const positionChangeCount =
    pickedPolitics[politicNumber - 1]?.positionChangeCount || 0
  const expertPointCount =
    pickedPolitics[politicNumber - 1]?.expertPointCount || 0
  const factCheckCount = pickedPolitics[politicNumber - 1]?.factCheckCount || 0
  const repeatCount = pickedPolitics[politicNumber - 1]?.repeatCount || 0

  const handlePrevSwitch = (number: number) => {
    if (Number(number - 1) > 0) {
      setPoliticNumber(number - 1)
    } else {
      setPoliticNumber(pickedPolitics.length)
    }
  }
  const handleNextSwitch = (number: number) => {
    if (Number(number + 1) > Number(pickedPolitics.length)) {
      setPoliticNumber(1)
    } else {
      setPoliticNumber(number + 1)
    }
  }

  useEffect(() => {
    setPoliticNumber(1) // category 如果有切換，政見數起始數字回歸 1
  }, [selectedCategory, politics])

  return (
    <Wrapper>
      <SwitchPanel hasPolitics={hasPolitics}>
        <SwitchArrowLeft
          className="switch-arrow"
          onClick={() => handlePrevSwitch(politicNumber)}
        />
        <CandidateInfo
          amount={pickedPolitics.length}
          name={person_id.name}
          politicNumber={politicNumber}
          isLoading={isLoading}
        />
        <SwitchArrowRight
          className="switch-arrow"
          onClick={() => handleNextSwitch(politicNumber)}
        />
      </SwitchPanel>

      <Content>
        {isLoading ? (
          <Loading>
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" />
          </Loading>
        ) : (
          <>
            <Category>{selectedCategory.name}</Category>

            {hasPolitics && desc ? (
              <PoliticDesc>
                <PoliticContent>{desc}</PoliticContent>
              </PoliticDesc>
            ) : (
              <DefaultDec>這個人還沒有被新增政見</DefaultDec>
            )}

            <DevMode>
              <p>政見 id：{politicId}</p>
              <span>立場數{positionChangeCount} |</span>
              <span>事實數{factCheckCount} |</span>
              <span>專家數{expertPointCount} |</span>
              <span>相似數{repeatCount}</span>
            </DevMode>

            {hasPolitics && <Feedback />}

            <LinkButtons
              hasPolitics={hasPolitics}
              politicId={politicId}
              personId={person_id.id}
            />
          </>
        )}
      </Content>
    </Wrapper>
  )
}
