<?php

namespace App\Repositories;

use App\Article;

class ArticlesRepository
{

    protected $Article;

    public function __construct(Article $Article)
	{
		$this->Article = $Article;
	}

	private function save(Article $Article, Array $inputs)
	{
		$Article->name = $inputs['name'];
		$Article->email = $inputs['email'];
		$Article->admin = isset($inputs['admin']);

		$Article->save();
	}

	public function getPaginate($n)
	{
		return $this->Article->paginate($n);
	}

	public function store(Array $inputs)
	{
		$Article = new $this->Article;
		$Article->password = bcrypt($inputs['password']);

		$this->save($Article, $inputs);

		return $Article;
	}

	public function getById($id)
	{
		return $this->Article->findOrFail($id);
	}

	public function update($id, Array $inputs)
	{
		$this->save($this->getById($id), $inputs);
	}

	public function destroy($id)
	{
		$this->getById($id)->delete();
	}

}
