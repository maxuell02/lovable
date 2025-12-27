try{
    await page.getByText('Welcome to Lovable 🎉Start').click();
    console.log('Conta Já Usada');
}catch{}


try{
    await page.getByText('Lixo Eletrônico').click(); 
    await page.getByText('Verify your email for Lovable').click();
    console.log('Conta Já Usada');
}catch{}