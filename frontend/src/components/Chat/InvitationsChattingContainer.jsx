import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import DefaultPageContainer from './DefaultPageContainer';
import InvitationPage from './InvitationPage';

const InvitationsChattingContainer = () => {
  const { slug } = useParams();
  let ActiveComponents=DefaultPageContainer;
if(slug)
  ActiveComponents = InvitationPage;
  return (
    <ActiveComponents />
  )
}

export default InvitationsChattingContainer