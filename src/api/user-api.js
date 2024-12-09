export const handleFetchCompanyInformation = async (companyId) => {
  try {
    const response = await fetch(`https://localhost:7176/User/GetCompanyInformation?company_id=${companyId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    console.log(data);

    return data;
    
  } catch (error) {
    console.error('There was a problem fetching company information:', error);
    return null;
  }
};

export const handleGetCompanyId = async (userId) => {
  try {
    const response = await fetch(`https://localhost:7176/User/GetCompanyId?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const companyId = await response.json();
    return companyId;
    
  } catch (error) {
    console.error('There was a problem fetching company ID:', error);
    return null;
  }
};

export const handleChangeCompanyCode = async (userId, companyId, password) => {
  try {
    const response = await fetch('https://localhost:7176/User/ChangeCompanyId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "userId": userId,
        "companyId": companyId,
        "password": password
      }),
    });

    console.log("UserId: "+ userId + ", CompanyId: " + companyId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error changing company code:', error);
  }
};
