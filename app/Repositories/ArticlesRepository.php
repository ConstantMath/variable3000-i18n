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
    $Article->title = $inputs['title'];
    $Article->slug = str_slug($inputs['title']);
    $Article->description = $inputs['description'];
    // $Article->status = $inputs['status'];
    // $Article->type = $inputs['type'];
    // $Article->order = $inputs['order'];
    // $Article->article_parent = $inputs['article_parent'];
		$Article->save();
	}

  public function getAll()
	{
		return $this->Article->get();
	}

	public function getPaginate($n)
	{
		return $this->Article->paginate($n);
	}

	public function store(Array $inputs)
	{
		$Article = new $this->Article;
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
