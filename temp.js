app.get(`order/:state/download-pdf`, async (req, res) => {

  const state = req.params.state;

  try {
    // Fetch the data from the database
    if(state==='pending'){
      const data = await orderCollection.find({ state: 'pending' });
    }
    else if(state === 'completed'){
      const data = await orderCollection.find({ state: 'completed' });
    }
    
    // Generate the PDF document
    const doc = new PDFDocument();
    doc.pipe(res); // Stream the PDF as a response
    
    // Add content to the PDF document
    doc.text('Your PDF Content');
    doc.text(JSON.stringify(data));
    
    doc.end(); // Finalize the PDF document
    
    client.close(); // Close the MongoDB connection
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});