const deleteProduct = (btn) => {
  console.log('Clicked');
  const parentNode = btn.parentNode;
  const productId = parentNode.querySelector('[name=productId]').value;
  const csrf = parentNode.querySelector('[name=_csrf]').value;

  const productElement = btn.closest('article');

  fetch(`/admin/product/${productId}`, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
  .then(result => {
    console.log(result);
    return result.json();
  })
  .then(data => {
    productElement.parentNode.removeChild(productElement);
  })
  .catch(console.error);
};
