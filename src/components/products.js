import React, { useEffect, useState } from "react";

const url = "http://localhost:8080/products"

export function Products() {
	const [content, setContent] = useState(<ProductList showForm={showForm} />);

	const showList = () => setContent(<ProductList showForm={showForm} />);
	
	function showForm(product) {
		setContent(<ProductForm product={product} showList={showList} />);
	}

	return (
		<div className="container my-5">
			{content}
		</div>	
	);
}

function ActionButton({ onClick, label, className }) {
	return (
		<button onClick={onClick} type="button" className={`btn btn-sm ${className} me-2`}>
			{label}
		</button>
	);
}

function ProductRow({ product, showForm, deleteProductById }) {
	const { id, name, description, category, price, amount, supplier, brand } = product;

	function renderActionButtons() {
    return (
      <td style={{width: "10px", whiteSpace: "nowrap"}}>
        <ActionButton onClick={() => showForm(product)} label="Edit" className="btn-primary" />
        <ActionButton onClick={() => deleteProductById(id)} label="Delete" className="btn-danger" />
      </td>
    );
  }
	
	return (
		<tr>
			<td>{id}</td>
			<td>{name}</td>
			<td>{description}</td>
			<td>{category}</td>
			<td>R$ {price}</td>
			<td>{amount}</td>
			<td>{supplier}</td>
			<td>{brand}</td>
			{renderActionButtons()}
		</tr>
	);
}

function ProductList({ showForm }) {
	const [products, setProducts] = useState([]);

	useEffect(() => findAllProducts(), []);

	function findAllProducts() {
		fetch(url)
			.then(response => response.json())
			.then(data => setProducts(data));
	}

	function deleteProductById(productId) {
		fetch(`${url}/${productId}`, {
			method: "DELETE"
		})
		.then(() => findAllProducts());
	}

	function renderProductRows() {
    return products.map((product, index) => (
      <ProductRow key={index} product={product} showForm={showForm} deleteProductById={deleteProductById} />
    ));
  }

	function renderButtons() {
    return (
      <>
        <ActionButton onClick={() => showForm({})} label="Create" className="btn-primary" />
        <ActionButton onClick={findAllProducts} label="Refresh" className="btn-outline-primary" />
      </>
    );
  }

	return (
		<>
			<h2 className="text-center mb-3">List of Products</h2>
			{renderButtons()}
			<table className="table">
				<thead>
					<tr>
						<td>ID</td>
						<td>Name</td>
						<td>Description</td>
						<td>Category</td>
						<td>Price</td>
						<td>Amount</td>
						<td>Supplier</td>
						<td>Brand</td>
					</tr>
				</thead>
				<tbody>
					{renderProductRows()}
				</tbody>
			</table>
		</>
	);
}

function ProductForm(props) {
	const readFormData = event => new FormData(event.target);
	const convertFormDataToObject = formData => Object.fromEntries(formData.entries());
	const convertToJsonString = data => JSON.stringify(data);

	function saveOrUpdateProduct(requestBody) {
		const endpoint = props.product.id ? `${url}/${props.product.id}` : url;
		const method = props.product.id ? "PUT" : "POST";

		return fetch(endpoint, {
			method: method,
			headers: { "Content-Type": "application/json" },
			body: requestBody
		})
		.then(() => props.showList());
	}

	function handleSubmit(event) {
		event.preventDefault();

		const formData = readFormData(event);
		const product = convertFormDataToObject(formData);
		const requestBody = convertToJsonString(product);
		
		saveOrUpdateProduct(requestBody);
	}

	return (
		<>
			<h2 className="text-center mb-3">{props.product.id ? "Edit Product" : "Create new Product"}</h2>
			<div className="row">
				<div className="col-lg-6 mx-auto">
					<form onSubmit={event => handleSubmit(event)}>
						{ 
							props.product.id && <div className="row mb-3">
								<label className="col-sm-4 col-form-label">ID</label>
								<div className="col-sm-8">
									<input readOnly={true} className="form-control-plain-text" name="id" defaultValue={props.product.id} />
								</div>
							</div> 
						}
						<div className="row mb-3">
							<label className="col-sm-4 col-form-label">Name</label>
							<div className="col-sm-8">
								<input className="form-control" name="name" defaultValue={props.product.name} />
							</div>
						</div>
						<div className="row mb-3">
							<label className="col-sm-4 col-form-label">Description</label>
							<div className="col-sm-8">
								<input className="form-control" name="description" defaultValue={props.product.description} />
							</div>
						</div>
						<div className="row mb-3">
							<label className="col-sm-4 col-form-label">Category</label>
							<div className="col-sm-8">
								<input className="form-control" name="category" defaultValue={props.product.category} />
							</div>
						</div>
						<div className="row mb-3">
							<label className="col-sm-4 col-form-label">Price</label>
							<div className="col-sm-8">
								<input className="form-control" name="price" defaultValue={props.product.price} />
							</div>
						</div>
						<div className="row mb-3">
							<label className="col-sm-4 col-form-label">Amount</label>
							<div className="col-sm-8">
								<input className="form-control" name="amount" defaultValue={props.product.amount} />
							</div>
						</div>
						<div className="row mb-3">
							<label className="col-sm-4 col-form-label">Supplier</label>
							<div className="col-sm-8">
								<input className="form-control" name="supplier" defaultValue={props.product.supplier} />
							</div>
						</div>
						<div className="row mb-3">
							<label className="col-sm-4 col-form-label">Brand</label>
							<div className="col-sm-8">
								<input className="form-control" name="brand" defaultValue={props.product.brand} />
							</div>
						</div>
						<div className="row">
							<div className="offset-sm-4 col-sm-4 d-grid">
								<button type="submit" className="btn btn-primary btn-sm me-3">Save</button>
							</div>
							<div className="col-sm-4 d-grid">
								<button onClick={() => props.showList()} type="button" className="btn btn-secondary btn-sm me-3">Cancel</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}