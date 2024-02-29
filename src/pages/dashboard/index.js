import Seo from '@/shared/layout-components/seo/seo';
import React from 'react';
import PageHeader from '../../shared/layout-components/pageheader/pageHeader';

const Dashboard = () => {
  return (
    <div>
      <Seo title="Dashboard"/>

      <div >
      <PageHeader titles="Dashboard" active="Dashboard" items={['Home']} />

    </div>
    </div>
  );
};

Dashboard.layout = "Contentlayout";
export default Dashboard;