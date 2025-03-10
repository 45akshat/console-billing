const sendTemplateMessage = async (whatsappNumber, templateName, broadcastName, parameters = []) => {
  const fetch = (await import('node-fetch')).default;
  const url = `https://live-mt-server.wati.io/411121/api/v1/sendTemplateMessage?whatsappNumber=${whatsappNumber}`;
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NjlhMzExYi0wZGVjLTQ4MWYtYjlhMC00ODM0M2EyYzY4MTMiLCJ1bmlxdWVfbmFtZSI6ImluZm9AY29uc29sZWdhbWluZy5pbiIsIm5hbWVpZCI6ImluZm9AY29uc29sZWdhbWluZy5pbiIsImVtYWlsIjoiaW5mb0Bjb25zb2xlZ2FtaW5nLmluIiwiYXV0aF90aW1lIjoiMDIvMjcvMjAyNSAxMzowMDowMyIsInRlbmFudF9pZCI6IjQxMTEyMSIsImRiX25hbWUiOiJtdC1wcm9kLVRlbmFudHMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBRE1JTklTVFJBVE9SIiwiZXhwIjoyNTM0MDIzMDA4MDAsImlzcyI6IkNsYXJlX0FJIiwiYXVkIjoiQ2xhcmVfQUkifQ.CtjCs1BcsqMMaVFhQYyylUTNQ9E-q7OLFqPLxG44fd0';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json-patch+json'
    },
    body: JSON.stringify({
      template_name: templateName,
      broadcast_name: broadcastName,
      parameters: parameters
    })
  });

  if (!response.ok) {
    throw new Error(`Error sending message: ${response.statusText}`);
  }

  return await response.json();
};

module.exports = {
  sendTemplateMessage
};
