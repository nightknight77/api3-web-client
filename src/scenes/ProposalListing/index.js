import React, {useState} from 'react'
import {useWeb3, actions} from 'lib/web3'
import {Card, VoteBar, Input} from 'lib/ui'
import {duration} from 'lib/util'
import {padStart, capitalize, noop} from 'lodash-es'
import {useModal} from 'lib/modal'
import {Button} from 'lib/ui'
import statusActiveIcon from './status-active.png'
import s from './style.css'


const {createProposal} = actions


const mockProposals = [{
    id: 1,
    title: 'Proposal one lorem ipsum',
    status: 'active',
    deadlineDuration: duration(60 * 60 * 24 * 2),
    for: 20,
    against: 10,
}, {
    id: 2,
    title: 'Proposal two dolor sit amet',
    status: 'rejected',
    deadlineDuration: duration(60 * 60 * 24 * 1),
    for: 20,
    against: 40,
}, {
    id: 3,
    title: 'Proposal three consectetuer adipisicing',
    status: 'passed',
    deadlineDuration: duration(60 * 60 * 24 * 3),
    for: 60,
    against: 40,
}]


const Proposals = () => {
    const
        web3 = useWeb3(),
        modal = useModal()

    return <Card
        cta1={{
            title: 'New Proposal',
            action: () => modal.open(ProposalForm, {
                onSubmit: val => {
                    console.info('proposal submitted', val)

                    createProposal(val.description, web3)
                },
            }),
        }}
        cta2={{
            title: 'View All Proposals',
            action: () => alert('Not implemented yet'),
        }}
    >
        <ul className={s.proposals}>
            {mockProposals.map(p =>
                <li key={p.id}>
                    <section className={s.info + ' ' + s[p.status]}>
                        <h3>{p.title}</h3>

                        <section>
                            <div className={s.status + ' ' + s[p.status]}>
                                {statusIcons[p.status]}
                                &nbsp;
                                {capitalize(p.status)}
                            </div>

                            <div className={s.idAndRemaining}>
                                {padStart(p.id, 2, '0')}

                                &nbsp;▲&nbsp;

                                {p.deadlineDuration.days}d&nbsp;
                                {p.deadlineDuration.hrs}h
                                remaining
                            </div>
                        </section>
                    </section>

                    <section className={s.votebar}>
                        <VoteBar
                            for_={p.for}
                            against={p.against}
                            active={p.status === 'active'}
                        />
                    </section>

                    <a
                        href='#nogo'
                        children='〉'
                        className={s.link}
                    />
                </li>,
            )}
        </ul>
    </Card>
}


const statusIcons = {
    active: <img src={statusActiveIcon} />,
    rejected: '✕',
    passed: '✓',
}


const ProposalForm = ({onSubmit = noop}) => {
    const [description, setDescription] = useState()

    return <>
        <Input
            onChange={e => setDescription(e.target.value)}
            placeholder='Description'
        />

        <Button
            onClick={() => onSubmit({description})}
            children='OK'
        />
    </>
}


export default Proposals
