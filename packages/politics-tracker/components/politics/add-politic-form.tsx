import { print } from 'graphql'
import { useEffect, useState } from 'react'

import CreatePolitic from '~/graphql/mutation/politics/create-politic.graphql'
import type { RawPolitic } from '~/types/common'
import type { Politic } from '~/types/politics'
import { fireGqlRequest } from '~/utils/utils'

import { useToast } from '../toast/use-toast'
import s from './add-politic-form.module.css'
import PoliticForm from './politic-form'
import {
  usePersonElection,
  usePoliticAmount,
  usePoliticList,
} from './react-context/use-politics'

type AddPoliticFormProps = {
  closeForm: () => void
}

export default function AddPoliticForm(
  props: AddPoliticFormProps
): JSX.Element {
  const defaultPolitic: Politic = {
    desc: '',
    source: '',
    content: '',
    politicCategoryId: null,
    politicCategoryName: null,
    createdAt: null,
    updatedAt: null,
    positionChange: [],
    factCheck: [],
    expertPoint: [],
    repeat: [],
  }

  const [isPartyPage, setIsPartyPage] = useState(false)
  useEffect(() => {
    const currentURL = window?.location.href
    const isOrgPolitics = currentURL.includes('party')
    setIsPartyPage(isOrgPolitics)
  }, [])

  const toast = useToast()
  const politicAmount = usePoliticAmount()
  const personElection = usePersonElection()
  const waitingPoliticList = usePoliticList()

  // client side only
  async function createPolitic(data: Politic): Promise<boolean> {
    const cmsApiUrl = `${window.location.origin}/api/data`

    try {
      let variables: any

      if (isPartyPage) {
        variables = {
          data: {
            organization: {
              connect: {
                id: personElection.id,
              },
            },
            desc: data.desc,
            source: data.source,
            content: data.content,
          },
        }
      } else {
        variables = {
          data: {
            person: {
              connect: {
                id: personElection.id,
              },
            },
            desc: data.desc,
            source: data.source,
            content: data.content,
          },
        }
      }

      // result is not used currently
      // eslint-disable-next-line
      const result: RawPolitic = await fireGqlRequest(
        print(CreatePolitic),
        variables,
        cmsApiUrl
      )

      const amount = politicAmount.amount
      politicAmount.setAmount({
        ...amount,
        waiting: amount.waiting + 1,
      })

      waitingPoliticList.addToList({
        id: String(new Date().valueOf()),
        ...variables.data,
        politicCategoryId: null,
        politicCategoryName: null,
        createdAt: null,
        updatedAt: null,
        positionChange: [],
        factCheck: [],
        expertPoint: [],
        repeat: [],
      })

      toast.open({
        status: 'success',
        title: '送出成功',
        desc: '通過志工審核後，您新增的政見就會出現在這裡',
      })

      props.closeForm()

      return true
    } catch (err) {
      console.error(err)

      toast.open({
        status: 'fail',
        title: '出了點問題...',
        desc: '送出失敗，請重試一次',
      })

      return false
    }
  }

  return (
    <form className={s['form']} method="POST">
      <span className={s['title']}>新增政見</span>
      <PoliticForm
        politic={defaultPolitic}
        closeForm={props.closeForm}
        submitForm={createPolitic}
      />
    </form>
  )
}
