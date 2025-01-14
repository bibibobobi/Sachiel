import CustomImage from '@readr-media/react-image'
import React from 'react'
import styled from 'styled-components'

import type { GenericPhoto } from '~/types/common'
import type { FactCheckPartner } from '~/types/politics-detail'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px 16px;
  background: ${({ theme }) => theme.backgroundColor.black};
  color: ${({ theme }) => theme.backgroundColor.white};

  ${({ theme }) => theme.breakpoint.md} {
    padding: 40px;
  }
`

const Title = styled.h2`
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0px auto 20px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 40px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 28px;
  }
`

const PartnerGroup = styled.div`
  margin: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 1130px;

  ${({ theme }) => theme.breakpoint.md} {
    gap: 20px;
  }
`

const Item = styled.a<{ href: string }>`
  display: block;
  width: 140px;
  height: 83px;
  background: ${({ theme }) => theme.backgroundColor.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ href }) => (href ? 'pointer' : 'auto')};

  ${({ theme }) => theme.breakpoint.md} {
    width: 157px;
    height: 92px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 170px;
    height: 100px;
  }
`

type PartnerByType = {
  type: string
  partners: {
    id: string
    name: string
    webUrl: string
    logo: GenericPhoto
  }[]
}
type FactCheckPartnersProps = {
  partners: FactCheckPartner[]
}
export default function FactCheckPartners({
  partners = [],
}: FactCheckPartnersProps): JSX.Element {
  function filterPartnersByType(partners: FactCheckPartner[]): PartnerByType[] {
    const transformedPartners: PartnerByType[] = partners.reduce(
      (result: PartnerByType[], item) => {
        const existingItem = result.find((el) => el.type === item.type)

        if (existingItem) {
          existingItem.partners.push({
            id: item.id || '',
            name: item.name || '',
            webUrl: item.webUrl || '',
            logo: item.logo || [],
          })
        } else {
          result.push({
            type: item.type || '',
            partners: [
              {
                id: item.id || '',
                name: item.name || '',
                webUrl: item.webUrl || '',
                logo: item.logo || [],
              },
            ],
          })
        }
        return result
      },
      []
    )

    return transformedPartners
  }

  const partnersByType = filterPartnersByType(partners)

  return (
    <>
      {partnersByType.map((item, index: number) => {
        return (
          <Wrapper key={index}>
            <Title>{item.type}</Title>
            <PartnerGroup>
              {item.partners.map((partner) => (
                <Item
                  key={partner.id}
                  href={partner.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CustomImage
                    images={partner?.logo?.resized}
                    defaultImage="/images/default-factcheck-partner.svg"
                    priority={true}
                    alt={partner.name}
                    objectFit="contain"
                  />
                </Item>
              ))}
            </PartnerGroup>
          </Wrapper>
        )
      })}
    </>
  )
}
